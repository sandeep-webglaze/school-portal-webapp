"use client";
import React, { FC, useEffect, useState } from "react";
import { Modal } from "../BaseModal";
import { uploadFile } from "@/api/uploader";
import { FILE_TYPE } from "@/constants";
import Image from "next/image";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
type UploadProps = {
  isOpen?: boolean;
  willClose?: boolean;

  onClose: () => void;
  handleProfileImageChange: (val?: string | null) => Promise<void>;
};
const UploadModal: FC<UploadProps> = ({
  handleProfileImageChange,
  isOpen = false,
  onClose,
  willClose = true,
}) => {
  const [response, setResponse] = React.useState<any>({
    alert: false,
    data: "",
    loading: false,
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<any>();
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  const handleClose = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
    onClose();
  };
  const handleRemove = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
  };
  const bodyContent = (
    <>
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left items-center justify-center">
        <h2 className="text-black text-lg font-medium">Update Photo</h2>

        <div className="flex items-center justify-center w-full mt-4">
          {selectedFile ? (
            <div className=" relative">
              <Image
                alt="preview"
                src={preview}
                width={300}
                height={300}
                className="max-h-48 max-w-48 border object-cover  object-top relative "
              />

              <RxCross2
                size={32}
                className="text-xl absolute top-[-10px] right-[-10px]  text-white cursor-pointer bg-red-600 rounded-full p-1  hover:bg-red-800"
                onClick={handleRemove}
              />
            </div>
          ) : (
            <label className="flex flex-col w-full h-32 border-4 border-green-200 border-dashed hover:bg-gray-100 hover:border-black-300">
              <div className="flex flex-col items-center justify-center pt-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="pt-1 text-sm tracking-wider text-black-400 group-hover:text-gray-600">
                  Attach a file
                </p>
              </div>
              <input
                type="file"
                name="img"
                className="opacity-0"
                onChange={onSelectFile}
                required
              />
            </label>
          )}
        </div>
      </div>
    </>
  );
  const onSubmit = () => {
    if (selectedFile && selectedFile.size >= 1048576) {
      toast.error("Image must be less than or equal to 1MB");
      setResponse({ loading: false });
      return;
    }
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }
    setResponse({ loading: true });
    const formData = new FormData();
    formData.append("file", selectedFile as any);
    formData.append("type", FILE_TYPE.PROFILE);
    uploadFile(formData)
      .then(async (uploadedImage) => {
        if (uploadedImage.data) {
          await handleProfileImageChange(uploadedImage.data);
        }
        setResponse({ loading: false });
        handleClose();
      })
      .catch(() => {
        setResponse({
          loading: false,
          alert: true,
          data: "An error occurred during upload",
        });
      });
  };
  return (
    <Modal
      isOpen={isOpen}
      title="Edit Profile"
      actionLabel="Update"
      willClose={willClose}
      large={false}
      onSubmit={onSubmit}
      onClose={handleClose}
      body={bodyContent}
    />
  );
};
export { UploadModal };
