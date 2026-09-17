"use client";

import { type FC, useState, useEffect } from "react";
import { Modal } from "..";
import { type FieldValues, useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { FcGoogle } from "react-icons/fc";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import useLoginModal from "@/hooks/useLoginModal";
import { CLIENT_TOKEN_STORAGE_KEY, SITE_NAME } from "@/constants";
import { setCookie } from "@/helpers";
import { OTPInput } from "@/components/OtpFiels";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "@/actions/firebase";
import type { ConfirmationResult } from "firebase/auth";
import { sendName, verifyByFireBase, verifyByFireBaseGoogle } from "@/api/otp";
import { googleLogin } from "@/app/google-login";
import {
  FaGraduationCap,
  FaCircleCheck,
  FaShieldHalved,
  FaHeadset,
} from "react-icons/fa6";

type LoginModalProps = {
  showRegister?: boolean;
  isOpen?: boolean;
  willClose?: boolean;
};

const BENEFITS = [
  { icon: FaCircleCheck, text: "Direct admission access to top schools" },
  { icon: FaHeadset, text: "Free, personalised counselling" },
  { icon: FaShieldHalved, text: "Unbiased & verified information" },
];

const LoginModal: FC<LoginModalProps> = ({
  showRegister = true,
  isOpen,
  willClose = true,
}) => {
  const loginModal = useLoginModal();
  const pathName = usePathname();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const {
    register,
    handleSubmit,
    watch: getValue,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const {
    register: verify,
    watch,
    setValue,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      otp: "",
    },
  });

  const phoneNumber = getValue("phoneNumber");
  const name = watch("name");
  const otp = watch("otp");

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (typeof window !== "undefined" && step === 1 && !recaptchaVerifier) {
      const initRecaptcha = () => {
        const container = document.getElementById("recaptcha-container");
        if (container) {
          try {
            const verifier = new RecaptchaVerifier(
              auth,
              "recaptcha-container",
              {
                size: "invisible",
                callback: () => {},
                "expired-callback": () => {
                  toast.error("reCAPTCHA expired. Please try again.");
                },
              }
            );
            setRecaptchaVerifier(verifier);
          } catch (error) {
            console.error("Error initializing reCAPTCHA:", error);
          }
        }
      };

      const timer = setTimeout(initRecaptcha, 100);
      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [step, recaptchaVerifier]);

  const isPhoneNumberValid = (phoneNumber: string) => {
    const trimmedPhoneNumber = phoneNumber.trim();
    return (
      trimmedPhoneNumber.length === 10 && /^\d{10}$/.test(trimmedPhoneNumber)
    );
  };

  const handleChangeClick = () => {
    setStep(1);
    setConfirmationResult(null);
  };

  const handleSendOtp = async () => {
    const trimmedPhoneNumber = phoneNumber.trim();
    setIsLoading(true);

    try {
      let verifier = recaptchaVerifier;
      if (!verifier) {
        const container = document.getElementById("recaptcha-container");
        if (!container) {
          throw new Error("reCAPTCHA container not found");
        }

        verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please try again.");
          },
        });
        setRecaptchaVerifier(verifier);
      }

      const formattedPhoneNumber = `+91${trimmedPhoneNumber}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        verifier
      );

      setConfirmationResult(confirmation);
      const response = await sendName({
        phoneNumber: String(trimmedPhoneNumber),
      });
      if (response.data?.name) {
        setValue("name", response.data.name);
        setIsDisabled(true);
      }
      setStep(2);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);

      if (error.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number format.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else if (error.code === "auth/captcha-check-failed") {
        toast.error("reCAPTCHA verification failed. Please try again.");
      } else if (error.code === "auth/argument-error") {
        toast.error(
          "Authentication setup error. Please refresh and try again."
        );
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }

      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitOtpForm = async ({ otp, name }: FieldValues) => {
    if (!confirmationResult) {
      toast.error("No confirmation result found. Please resend OTP.");
      return;
    }
    if (!name || name.trim() === "") {
      toast.error("Please enter your name.");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();
      const phoneNumber = result.user.phoneNumber;
      if (!name) {
        toast.error("Name is required for verification.");
        return;
      }

      const res = await verifyByFireBase({
        idToken,
        name,
        phoneNumber: phoneNumber ?? undefined,
      });

      if (res && res.data?.access_token) {
        toast.success("OTP verified successfully!");
        setCookie(CLIENT_TOKEN_STORAGE_KEY, res.data.access_token, 30);
        loginModal.onClose();
        window.location.reload();
      } else {
        toast.error(res?.error?.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please check and try again.");
      } else if (error.code === "auth/code-expired") {
        toast.error("OTP has expired. Please request a new one.");
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Authentication Handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const userData = {
        idToken,
        mail: user.email || undefined,
        name: user.displayName || "",
        imageUrl: user.photoURL || undefined,
      };

      const res = await verifyByFireBaseGoogle(userData);

      if (res && res.data?.access_token) {
        toast.success("Google login successful!");
        setCookie(CLIENT_TOKEN_STORAGE_KEY, res.data.access_token, 30);
        loginModal.onClose();

        if (pathName && pathName !== "/") {
          window.location.href = pathName;
        } else {
          window.location.reload();
        }
      } else {
        toast.error(res?.error?.message || "Google login failed");
      }
    } catch (error: any) {
      console.error("Error with Google login:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Login cancelled by user");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        return;
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const bodyContent =
    step === 2 ? (
      // ---------------- OTP step ----------------
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <span className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 text-white flex items-center justify-center text-2xl shadow-md">
            <FaGraduationCap />
          </span>
          <h3 className="mt-3 text-xl font-extrabold text-blacky-light">
            Verify your number
          </h3>
          <p className="text-sm text-blacky-light/60 mt-1">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-blacky-light">
              +91 {phoneNumber}
            </span>
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-blacky-light">
            Full Name
          </label>
          <input
            {...verify("name", { required: true })}
            disabled={isDisabled}
            placeholder="Enter your name"
            className="mt-1.5 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition disabled:bg-grayish-light disabled:text-blacky-light/60"
          />
          {otpErrors.name && (
            <span className="text-xs text-red-500 mt-1 block">
              Please enter your name
            </span>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-blacky-light">
            One Time Password
          </label>
          <div className="mt-2">
            <OTPInput
              otp={otp}
              onChange={(otp: string) => setValue("otp", otp)}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    ) : (
      // ---------------- Phone step ----------------
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <span className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 text-white flex items-center justify-center text-2xl shadow-md">
            <FaGraduationCap />
          </span>
          <h3 className="mt-3 text-xl font-extrabold text-blacky-light">
            Welcome to {SITE_NAME}
          </h3>
          <p className="text-sm text-blacky-light/60 mt-1">
            Login or sign up in seconds to shortlist schools & get admission
            help.
          </p>
        </div>

        <div className="rounded-xl bg-[#eef4fb] border border-gray-100 p-4 flex flex-col gap-2.5">
          {BENEFITS.map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-2.5 text-sm text-blacky-light/80"
            >
              <b.icon className="text-green-600 shrink-0" />
              {b.text}
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-semibold text-blacky-light">
            Phone Number
          </label>
          <div className="mt-1.5 flex items-stretch rounded-xl border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 overflow-hidden transition">
            <span className="flex items-center px-3 bg-grayish-light text-sm font-semibold text-blacky-light/70 border-r border-gray-200">
              +91
            </span>
            <input
              {...register("phoneNumber", { required: true })}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter your number"
              className="flex-1 h-12 px-3 text-sm outline-none bg-white"
            />
          </div>
          {errors.phoneNumber && (
            <span className="text-xs text-red-500 mt-1 block">
              Please enter a valid 10-digit number
            </span>
          )}
        </div>

        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    );

  const footerContent = (
    <div className="flex flex-col gap-3 mt-4">
      <div className="relative text-center">
        <span className="relative z-10 bg-white px-3 text-xs text-blacky-light/40">
          or continue with
        </span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
      </div>
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => googleLogin(pathName)}
      />
      <p className="text-[11px] text-center text-blacky-light/45 mt-1">
        By continuing you agree to our Terms &amp; Privacy Policy.
      </p>
    </div>
  );

  const modalActionLabel = step === 1 ? "Send OTP" : "Verify & Continue";

  return (
    <Modal
      isOpen={isOpen ?? loginModal.isOpen}
      title="Login / Sign up"
      actionLabel={modalActionLabel}
      disabled={isLoading}
      willClose={willClose}
      onClose={loginModal.onClose}
      onSubmit={
        step === 1 ? handleSubmit(handleSendOtp) : handleOtpSubmit(submitOtpForm)
      }
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export { LoginModal };
