"use client";

import { CSSProperties, Fragment, ReactNode } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  icon?: ReactNode;
  style?: CSSProperties;
  prefix?: string;
  maxLength?: number;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  prefix,
  id,
  label,
  style,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  onChange,
  errors,
  icon,
  maxLength,

  minLength,
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const value = e.target.value.replace(/\D/g, "");
      if (maxLength && value.length > maxLength) {
        e.target.value = value.slice(0, maxLength);
      } else {
        e.target.value = value;
      }
    }
  };

  return (
    <div className="w-full relative" style={style}>
      {icon && <Fragment>{icon}</Fragment>}
      {prefix && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          {prefix}
        </span>
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={label}
        onChange={(e) => {
          register(id, { required }).onChange(e);
          onChange != null && onChange(e);
        }}
        type={type}
        maxLength={type === "number" ? undefined : maxLength}
        minLength={type === "number" ? undefined : minLength}
        className={`
          peer
          w-full
          px-2
          h-[40px]
          leading-[40px]
          font-light 
          bg-white 
          border
          border-[#cccccc]
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          placeholder:text-[#808080]
          ${prefix ? "pl-10" : "pl-2"}
          ${errors[id] && "border-rose-500"}
          ${
            errors[id]
              ? "focus:border-rose-500"
              : "focus:border-2 focus:border-black"
          }
        `}
        onInput={type === "number" ? handleInput : undefined}
        inputMode={type === "number" ? "numeric" : undefined}
        pattern={type === "number" ? "\\d*" : undefined}
      />
    </div>
  );
};

export { Input };
