import { API_HOST, CLIENT_TOKEN_STORAGE_KEY } from "@/constants";

export async function waitForSeconds(seconds: number) {
  return new Promise((res) => {
    setTimeout(res, 1000 * seconds);
  });
}

export function isNotEmpty<T>(obj: T | null | undefined): obj is T {
  return !isEmpty(obj);
}

export function isEmpty(obj: unknown): obj is null | undefined {
  return obj == null || obj == undefined;
}

/**
 * Defensive JSON.parse — never throws.
 *
 * Returns the parsed value, or `fallback` if the input is null/undefined/
 * empty/malformed. Used for fields that come straight from the API and may
 * be `null`, an empty string, or invalid JSON (e.g. `slugJsonSchema`).
 *
 * Without this, a single bad row in the DB takes down a whole page render
 * with `Unexpected token in JSON at position N`.
 */
export function safeJsonParse<T = unknown>(
  raw: string | null | undefined,
  fallback: T,
): T {
  if (raw == null || raw === "") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    if (typeof window === "undefined") {
      console.warn("safeJsonParse: malformed JSON, using fallback.", err);
    }
    return fallback;
  }
}

export function generateURI<T>(
  path: string,
  query?: Record<string, string | number | boolean> | T,
): string {
  const serializedQuery = querySerialize<T>(query);
  const queryString = serializedQuery !== "" ? `?${serializedQuery}` : "";
  return `${API_HOST}${path}${queryString}`;
}

function querySerialize<T>(
  queryObj?: Record<string, string | number | boolean> | T,
): string {
  if (!queryObj) {
    return "";
  }
  const queryString = Object.entries(queryObj)
    .filter(
      ([_, value]) =>
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean") &&
        value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  return queryString;
}

export function removeNullOrUndefinedEmptyFields(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Remove null, undefined, and empty elements from the array
    return obj.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(Array.isArray(item) && item.length === 0),
    );
  }

  // Remove null, undefined, and empty array fields from the object
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = removeNullOrUndefinedEmptyFields(obj[key]);
      if (
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        result[key] = value;
      }
    }
  }
  return result;
}

export function getCoockieExpiryDate(expDays: number = 30) {
  // default tp 30 days
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  return date;
}

// Set a Cookie
export function setCookie(cName: string, cValue: string, expDays: number) {
  if (document && window) {
    let date = getCoockieExpiryDate();
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }
}

export function removeUserToken() {
  var d = new Date();
  d.setTime(d.getTime());
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    CLIENT_TOKEN_STORAGE_KEY + "=" + "" + "; " + expires + "; path=/";
}

export function getToken() {
  if (document && window) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${CLIENT_TOKEN_STORAGE_KEY}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
  }
}

export function formatDate(date: any) {
  const currentDate = new Date(date);

  // Define the format options
  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", options as any).format(
    currentDate,
  );
  return formattedDate;
}

/**
 * Converts a string to Title Case (first letter capital, rest lowercase per word).
 * Handles ALL-CAPS names like "JAIN INTERNATIONAL" → "Jain International"
 */
// export function toTitleCase(str: string): string {
//   if (!str) return "";
//   return str
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }

export function toTitleCase(str: string): string {
  if (!str) return "Not Found School Name";
  return str;
}

const getInitials = (name: string) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;

  initials = nameSplit[0].substring(0, 1);

  return initials.toUpperCase();
};

export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const createImageFromInitials = (size: number, name: string) => {
  const color = getRandomColor();
  if (name == null) return;
  name = getInitials(name) ?? " ";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = canvas.height = size;
  if (context) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);

    context.fillStyle = `${color}50`;
    context.fillRect(0, 0, size, size);

    context.fillStyle = color;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = `${size / 2}px Times New Roman`;
    context.fillText(name, size / 2, size / 2);
  }

  return canvas.toDataURL();
};

export function isStrongPassword(password: string) {
  let isValid = true;
  let message = "";

  // Check if the password length is at least 8 characters
  if (password.length < 8) {
    isValid = false;
    message = "Password must be at least 8 characters long.";
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one uppercase letter.";
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one lowercase letter.";
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    isValid = false;
    message = "Password must contain at least one digit.";
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one special character.";
  }

  // Check if the password is not a common word or easily guessable pattern
  const commonWords = ["password", "123456", "qwerty", "abc123", "test"]; // Add more common words/patterns as needed
  if (commonWords.includes(password.toLowerCase())) {
    isValid = false;
    message =
      "Please choose a password that is not a common word or easily guessable pattern.";
  }

  return { isValid, message };
}
