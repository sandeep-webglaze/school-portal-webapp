"use client";
import useAuthStore from "@/hooks/useUserState";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

const LoginModal = dynamic(
  () => import("@/components/Modals").then((mod) => mod.LoginModal),
  { ssr: false }
);

const DeleteAccount = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated)
    return <LoginModal showRegister={false} isOpen willClose={false} />;
  else return redirect("/account/delete");
};

export default DeleteAccount;
