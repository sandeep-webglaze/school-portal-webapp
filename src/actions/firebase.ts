import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  ConfirmationResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
export let confirmationResult: ConfirmationResult | null = null;

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initRecaptcha = (): void => {
  if (typeof window !== "undefined" && !recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        console.warn("reCAPTCHA expired.");
      },
    });
  }
};

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

export const sendOtp = async (phoneNumber: string): Promise<void> => {
  if (!recaptchaVerifier) initRecaptcha();

  const formattedPhone = `+91${phoneNumber}`;

  if (!recaptchaVerifier) {
    throw new Error("Failed to initialize reCAPTCHA");
  }

  confirmationResult = await signInWithPhoneNumber(
    auth,
    formattedPhone,
    recaptchaVerifier,
  );
};

export const verifyOtp = async (otp: string): Promise<string> => {
  if (!confirmationResult) {
    throw new Error("Confirmation result not found");
  }

  const result = await confirmationResult.confirm(otp);
  const idToken = await result.user.getIdToken();
  return idToken;
};
export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
};
