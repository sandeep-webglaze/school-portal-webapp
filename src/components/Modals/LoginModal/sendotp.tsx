"use client";
import React, { FC, useCallback, useState } from "react";
import { Modal } from "..";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { FcGoogle } from "react-icons/fc";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { signin } from "@/api/SignIn";
import toast from "react-hot-toast";
import { setCookie } from "@/helpers";
import PasswordInput from "@/components/Input/PasswordInput";
import { googleLogin } from "@/app/google-login";
import useForgotModal from "@/hooks/useForgotModal";

type LoginModalProps = {
  showRegister?: boolean;
  isOpen?: boolean;
  willClose?: boolean;
};
const LoginModal: FC<LoginModalProps> = ({
  showRegister = true,
  isOpen,
  willClose = true,
}) => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const forgotModal = useForgotModal();

  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [registerModal, loginModal]);

  const openForgotModal = useCallback(() => {
    loginModal.onClose();
    forgotModal.onOpen();
  }, [forgotModal, loginModal]);

  const onSubmit: SubmitHandler<FieldValues> = ({ email, password }) => {
    setIsLoading(true);

    signin({ mail: email, password })
      .then((response) => {
        setIsLoading(false);

        if (response?.data && response.data.access_token) {
          setCookie(CLIENT_TOKEN_STORAGE_KEY, response.data.access_token, 30);
          loginModal.onClose();
          window.location.reload();
        }
        if (response?.error) {
          toast.error(response.error.message, { id: "loginError1" });
        }
      })
      .catch((err) => {
        console.error("Error in Login", err);
        toast.error(err.error.message, { id: "loginError1" });
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={false}
        register={register}
        errors={errors}
        required
      />
      <div>
        <PasswordInput {...{ register, errors }} />
        <p
          className="text-neutral-500 hover:text-neutral-800 text-right 
              cursor-pointer 
              text-sm
              underline mx-1 mt-2"
          onClick={openForgotModal}
        >
          Forgot Password
        </p>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => googleLogin(pathName)}
      />
      {showRegister && (
        <div
          className="
      text-neutral-500 text-center mt-4 font-light"
        >
          <p>
            First time here?
            <span
              onClick={onToggle}
              className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            >
              {" "}
              Create an account
            </span>
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen ?? loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      disabled={false}
      willClose={willClose}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export { LoginModal };