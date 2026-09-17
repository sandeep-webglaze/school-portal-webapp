import {
  BadRequestException,
  ErrorSchema,
  FetchDataException,
  InternalServerException,
  NotFoundException,
  TimeOutException,
  UnAuthorizedException,
} from ".//BaseError";
import { Response as CustomResponse } from "../types";

/**
 * Safely turn the response body into an object, no matter what the server
 * sent back. Servers occasionally return:
 *   - empty bodies (204, idle gateway timeouts)
 *   - HTML error pages (nginx 502/504, proxy crashes)
 *   - plain text errors
 *   - malformed JSON
 * Any of those would crash a naive `await response.json()` with a SyntaxError.
 */
async function safeReadBody(
  response: Response,
): Promise<{ json: any; raw: string }> {
  let raw = "";
  try {
    raw = await response.text();
  } catch (e) {
    // body already consumed or stream error — give up gracefully
    return { json: {}, raw: "" };
  }
  if (!raw) return { json: {}, raw };
  try {
    return { json: JSON.parse(raw), raw };
  } catch {
    return { json: {}, raw };
  }
}

/**
 * Pull a usable message out of whatever shape the server returned.
 * Handles: { message: "..." }, { message: ["..", ".."] }, { error: "..." },
 * { displayMessage: "..." }, raw text fallbacks, undefined.
 */
function extractMessage(json: any, raw: string, fallback: string): string {
  if (json && typeof json === "object") {
    if (typeof json.displayMessage === "string") return json.displayMessage;
    if (typeof json.message === "string") return json.message;
    if (Array.isArray(json.message))
      return json.message.filter(Boolean).join("; ") || fallback;
    if (typeof json.error === "string") return json.error;
  }
  // raw text from nginx / non-JSON 5xx — keep it short, strip HTML
  if (raw && raw.length < 300) {
    const stripped = raw.replace(/<[^>]+>/g, "").trim();
    if (stripped) return stripped;
  }
  return fallback;
}

async function exceptionHandler<T>(
  response?: Response,
): Promise<CustomResponse<T>> {
  if (!response) {
    throw new FetchDataException();
  }

  const { json, raw } = await safeReadBody(response);

  if (response.ok) {
    // Success but body might still be empty/non-object — return as-is and let
    // callers handle missing fields. Don't throw on success.
    return (json ?? {}) as CustomResponse<T>;
  }

  const message = extractMessage(json, raw, response.statusText || "Error");

  switch (true) {
    case response.status === 401 || response.status === 403:
      throw new UnAuthorizedException(message);
    case response.status === 400:
      throw new BadRequestException(message);
    case response.status === 404:
      throw new NotFoundException(message);
    case response.status === 408:
      throw new TimeOutException(message);
    case response.status >= 500:
      throw new InternalServerException(message);
    default:
      throw new ErrorSchema(
        response.status,
        message,
        "Something went wrong, please try again",
      );
  }
}

/**
 * Original behaviour preserved: throws on non-2xx, returns parsed body on
 * success. Hardened so it can never crash on a non-JSON / empty / HTML body.
 */
export async function responseHandler<T>(response: Response) {
  try {
    return await exceptionHandler<T>(response);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error as ErrorSchema<T>;
  }
}

/**
 * Drop-in fetch wrapper that NEVER throws and ALWAYS returns the
 * { data?, error?, totalCount? } shape. Use this in new code so you don't
 * have to write try/catch around every call site.
 *
 *   const res = await safeFetch<HomePageResponse>(`${API_HOST}/homepage`);
 *   if (res.error) { /* render fallback *\/ }
 *   else { /* use res.data *\/ }
 *
 * Handles: network failures, timeouts, non-JSON 5xx (nginx HTML pages),
 * malformed JSON, and missing bodies — all collapse into a uniform
 * `Response<T>` with `.error` populated.
 */
export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number },
): Promise<CustomResponse<T>> {
  const { timeoutMs = 15000, ...fetchInit } = init ?? {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response | undefined;
  try {
    response = await fetch(input, {
      ...fetchInit,
      signal: fetchInit.signal ?? controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    // network down, DNS, abort, CORS, etc. — never throw, return error shape.
    const isAbort = err?.name === "AbortError";
    const ex = isAbort
      ? new TimeOutException(`Request timed out after ${timeoutMs}ms`)
      : new FetchDataException(err?.message ?? "Network request failed");
    return { error: (ex as ErrorSchema<T>).error };
  }
  clearTimeout(timer);

  try {
    return await exceptionHandler<T>(response);
  } catch (err) {
    if (err instanceof ErrorSchema) {
      return { error: err.error };
    }
    // truly unexpected — wrap so caller still gets the shape
    return {
      error: {
        code: 500,
        message: (err as Error)?.message ?? "Unknown error",
        displayMessage: "Something went wrong, please try again",
      },
    };
  }
}
