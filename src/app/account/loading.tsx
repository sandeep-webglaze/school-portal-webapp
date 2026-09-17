"use client";
import React from "react";
import Spinner from "../../components/Spinner";

const loading = () => {
  return (
    <div
      className="
      w-full
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <Spinner />
    </div>
  );
};

export default loading;
