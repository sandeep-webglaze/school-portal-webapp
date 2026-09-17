export const LOCAL_IP_HOST = "http://192.168.1.38:8080";
export const LOCAL_SERVER_HOST = "http://localhost:8080";

// IMPORTANT: point these at YOUR OWN backend — not EdHippo's.
// While developing, this uses your local NestJS server (localhost:8080),
// which talks to your own MongoDB. When you deploy your server, set
// PRODUCTION_SERVER to your deployed API URL and IMAGES_HOST to your CDN.
export const PRODUCTION_SERVER = "http://localhost:8080";
export const IMAGES_HOST = "https://cdn.educationportal.ae/";
export const NODE_ENV = process.env.NODE_ENV;
export const HOST = PRODUCTION_SERVER;

export const API_HOST = `${HOST}/api`;
