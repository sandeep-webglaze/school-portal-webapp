"use client";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";

const LoginModal = dynamic(
  () => import("@/components/Modals").then((mod) => mod.LoginModal),
  { ssr: false }
);

const AuthModals = () => {
  return (
    <Fragment>
      <LoginModal />
    </Fragment>
  );
};

export default AuthModals;
