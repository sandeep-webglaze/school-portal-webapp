// ---------------------------------------------------------------------------
// School Portal — API client (runs inside the SAME Next.js webapp).
//
// This talks to the EXISTING backend that the standalone "edhippo-school-panel"
// used, so no backend change is needed. A school owner (role: "school-admin")
// logs in with email + password, we keep their access token in localStorage
// (under a dedicated key so it never clashes with the parent/user login), and
// every authed call sends it as a Bearer token.
//
// Endpoints (verified against the school panel):
//   POST /auth/login                     -> { access_token, role }
//   POST /auth/forgot-otp                -> send reset OTP
//   POST /auth/forgot-session            -> { token }
//   POST /auth/reset-password
//   GET  /homepage/school-panel          -> dashboard bundle
//   GET  /leads/available                -> leads a school can buy
//   GET  /leads/my-leads                 -> purchased leads
//   POST /transactions/purchase-leads    -> buy leads with wallet balance
//   GET  /wallets/my-wallet              -> wallet balance
//   POST /transactions/credit-wallet     -> start a wallet top-up
//   GET  /transactions                   -> transaction history
//   GET  /user/profile  /  PUT /user/profile
// ---------------------------------------------------------------------------

import { API_HOST } from "@/constants";

export const SCHOOL_ROLE = "school-admin";
const TOKEN_KEY = "sp_token"; // school-portal token (separate from user login)
const ROLE_KEY = "sp_role";
const NAME_KEY = "sp_name";

// ----------------------------- types -----------------------------
export type ApiResult<T> = { data?: T; error?: { message?: string } };

export interface ILead {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  class?: string;
  gender?: string;
  actualPrice?: number;
  currentPrice?: number;
  generatedAt?: string;
  city?: { city?: string } | null;
  schoolType?: { name?: string } | null;
}

export interface IWallet {
  _id?: string;
  amount: number;
  lastPaymentAt?: string;
  updatedAt?: string;
}

export interface ITransaction {
  _id: string;
  transactionId?: string;
  type?: string;
  amount: number;
  timestamp?: string;
  status?: string;
  paymentMethod?: string;
  description?: string;
}

export interface DashboardData {
  wallet?: IWallet;
  transactions?: ApiResult<ITransaction[]>;
  myLeads?: ApiResult<ILead[]>;
}

export interface ISchoolProfile {
  _id?: string;
  name?: string;
  mail?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  [key: string]: unknown;
}

// ----------------------------- session -----------------------------
export const saveSession = (token: string, role?: string, name?: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (role) localStorage.setItem(ROLE_KEY, role);
    if (name) localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
};
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const getSchoolName = (): string => {
  try {
    return localStorage.getItem(NAME_KEY) || "School";
  } catch {
    return "School";
  }
};
export const isLoggedIn = (): boolean => !!getToken();
export const logout = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
  } catch {
    /* ignore */
  }
};

// ----------------------------- fetch core -----------------------------
async function spFetch<T>(
  path: string,
  opts: RequestInit = {},
  auth = true
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(opts.headers as Record<string, string>),
    };
    if (auth) {
      const t = getToken();
      if (t) headers.Authorization = `Bearer ${t}`;
    }
    const res = await fetch(`${API_HOST}${path}`, {
      ...opts,
      headers,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        error: { message: json?.message || `Request failed (${res.status})` },
      };
    }
    // backend responses are usually { data } or the object itself
    return { data: (json?.data ?? json) as T };
  } catch (e) {
    return { error: { message: (e as Error)?.message || "Network error" } };
  }
}

const qs = (query?: Record<string, string | number | undefined>) => {
  if (!query) return "";
  const parts = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

// ----------------------------- auth -----------------------------
export function login(mail: string, password: string) {
  return spFetch<{ access_token: string; role: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ mail, password }) },
    false
  );
}
export function forgotOtp(mail: string) {
  return spFetch<{ acknowledged?: boolean }>(
    "/auth/forgot-otp",
    { method: "POST", body: JSON.stringify({ mail }) },
    false
  );
}
export function forgotSession(mail: string, otp: string) {
  return spFetch<{ token: string }>(
    "/auth/forgot-session",
    { method: "POST", body: JSON.stringify({ mail, otp }) },
    false
  );
}
export function resetPassword(token: string, password: string) {
  return spFetch<{ acknowledged?: boolean }>(
    "/auth/reset-password",
    { method: "POST", body: JSON.stringify({ token, password }) },
    false
  );
}

// ----------------------------- data -----------------------------
export const getDashboard = () =>
  spFetch<DashboardData>("/homepage/school-panel");

export const getAvailableLeads = (query?: Record<string, string | number>) =>
  spFetch<ILead[]>(`/leads/available${qs(query)}`);

export const getMyLeads = (query?: Record<string, string | number>) =>
  spFetch<ILead[]>(`/leads/my-leads${qs(query)}`);

export const purchaseLeads = (leads: string[]) =>
  spFetch<unknown>("/transactions/purchase-leads", {
    method: "POST",
    body: JSON.stringify({ leads }),
  });

export const getWallet = () => spFetch<IWallet>("/wallets/my-wallet");

export const creditWallet = (amount: number) =>
  spFetch<{ orderId: string; amount: string }>("/transactions/credit-wallet", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const getTransactions = (query?: Record<string, string | number>) =>
  spFetch<ITransaction[]>(`/transactions${qs(query)}`);

export const getProfile = () => spFetch<ISchoolProfile>("/user/profile");

export const updateProfile = (body: Partial<ISchoolProfile>) =>
  spFetch<{ acknowledged?: boolean }>("/user/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });

// ----------------------------- my school -----------------------------
type Ref = { _id: string; name?: string; city?: string };

export interface ISchoolFull {
  _id: string;
  name?: string;
  chairman?: string;
  medium?: string;
  about?: string;
  contactNumber?: string;
  mail?: string;
  website?: string;
  classFrom?: string;
  classTo?: string;
  admissionStart?: string;
  admissionEnd?: string;
  minFees?: number;
  maxFees?: number;
  establishmentYear?: number;
  published?: boolean;
  isFeatured?: boolean;
  images?: string[];
  categoriesSlugs?: string[];
  classification?: Ref;
  type?: Ref[];
  city?: Ref;
  schoolBoards?: Ref[];
  facilities?: Ref[];
  slug?: { slug?: string } | string;
}

export interface IEnquiry {
  _id: string;
  name?: string;
  email?: string;
  message?: string;
  pageUrl?: string;
  status?: string;
  createdAt?: string;
}

export const getSchoolById = (id: string) =>
  spFetch<ISchoolFull>(`/school/${id}`);

// PUT /school — updates the school. We send the FULL flattened body so the
// backend keeps every field; only the edited text fields change.
export const updateSchool = (body: Record<string, unknown>) =>
  spFetch<unknown>("/school", { method: "PUT", body: JSON.stringify(body) });

export const getSchoolEnquiries = (query?: Record<string, string | number>) =>
  spFetch<IEnquiry[]>(`/school-enquiry${qs(query)}`);

// Helper: flatten a loaded school (nested refs) into the shape PUT expects.
export function flattenSchool(s: ISchoolFull): Record<string, unknown> {
  const slug =
    typeof s.slug === "string" ? s.slug : s.slug?.slug ?? "";
  return {
    ...s,
    classification: s.classification?._id,
    type: (s.type ?? []).map((t) => t._id),
    city: s.city?._id,
    schoolBoards: (s.schoolBoards ?? []).map((b) => b._id),
    facilities: (s.facilities ?? []).map((f) => f._id),
    images: s.images ?? [],
    categoriesSlugs: s.categoriesSlugs ?? [],
    slug,
  };
}
