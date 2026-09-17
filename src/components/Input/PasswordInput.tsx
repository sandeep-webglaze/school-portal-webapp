import React, { FC, Fragment, useState } from "react";
import { Input } from "./component";
import { IoMdEye } from "react-icons/io";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { IoMdEyeOff } from "react-icons/io";

type PasswordInputProps = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  id?: string;
};
const PasswordInput: FC<PasswordInputProps> = ({ register, errors, id }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassowrd = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Input
      id={id ?? "password"}
      label="Password"
      type={showPassword ? "text" : "password"}
      icon={
        <Fragment>
          {showPassword ? (
            <IoMdEye
              size={24}
              onClick={handleShowPassowrd}
              className=" text-neutral-700 cursor-pointer
                 absolute
                    top-[10px]
                 right-2"
            />
          ) : (
            <IoMdEyeOff
              size={24}
              onClick={handleShowPassowrd}
              className=" text-neutral-700 cursor-pointer
                 absolute
                 top-[10px]
                 right-2"
            />
          )}
        </Fragment>
      }
      disabled={false}
      register={register}
      errors={errors}
      required
    />
  );
};

export default PasswordInput;
