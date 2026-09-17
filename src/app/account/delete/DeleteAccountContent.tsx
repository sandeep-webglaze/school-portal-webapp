"use client";
import { deleteAccount } from "@/api/CurrentUser";
import { ErrorResponseSchema } from "@/api/types";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const DeleteAccountContent = () => {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  if (status)
    return (
      <div className="mx-auto ">
        <Image
          src="https://img.freepik.com/premium-vector/check-mark-icon-flat-style-ok-accept-vector-illustration-white-isolated-background-tick-business-concept_157943-544.jpg?w=740"
          alt="Account deletion request received"
          width={160}
          height={160}
          className="size-40 m-auto my-4"
        />
        <p className="mx-auto mt-4 max-w-lg text-justify text-gray-500">
          We have successfully received your request for the deletion of your
          account with Edhippo Academy. Our team is currently processing your
          request, and your account will be removed from our system with in 30
          days.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-justify text-gray-500">
          Please note that for security and data protection reasons, we kindly
          request that you refrain from logging into your account during this
          process if you ever make a login request your deletion process will be
          aborted.
        </p>
      </div>
    );
  else
    return (
      <div className="flex flex-col gap-6 max-w-md m-auto border shadow rounded-md p-8">
        <h1 className="font-bold text-2xl">Delete Account</h1>
        <p>
          Deleting your account will remove all of your information from our
          databases. This cannot be undone.
        </p>
        <button
          type="button"
          className={`  ${
            loading && "cursor-not-allowed flex justify-center"
          } focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 `}
          onClick={createDeleteRequest}
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          Delete account
        </button>
      </div>
    );

  async function createDeleteRequest() {
    try {
      setLoading(true);
      await deleteAccount();
      setStatus(true);
    } catch (error) {
      toast.error(
        (error as ErrorResponseSchema).error?.displayMessage ??
          "Something Went Wrong!"
      );
    } finally {
      setLoading(false);
    }
  }
};

export default DeleteAccountContent;
