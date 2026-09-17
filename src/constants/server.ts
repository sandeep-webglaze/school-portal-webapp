export const LOCAL_IP_HOST = "http://192.168.1.38:8080";
export const LOCAL_SERVER_HOST = "http://localhost:8080";

// Fallback used only for local development when NEXT_PUBLIC_API_HOST is not set.
export const PRODUCTION_SERVER = "http://localhost:8080";

// API + image hosts come from environment variables so you set the deployed
// backend URL once in your host (Vercel / Render), not in code.
//   NEXT_PUBLIC_API_HOST    -> your deployed backend, e.g. https://your-server.onrender.com
//   NEXT_PUBLIC_IMAGES_HOST -> your image CDN (optional)
export const IMAGES_HOST =
  process.env.NEXT_PUBLIC_IMAGES_HOST || "https://cdn.educationportal.ae/";

export const NODE_ENV = process.env.NODE_ENV;

export const HOST = process.env.NEXT_PUBLIC_API_HOST || PRODUCTION_SERVER;

export const API_HOST = `${HOST}/api`;
