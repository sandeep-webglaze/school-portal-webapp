"use client";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  fullWidth?: boolean;
  large?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  type = "button",
  icon: Icon,
  fullWidth = false,
  large = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded
        hover:opacity-80
        transition
        shadow-md
        font-semibold
        ${fullWidth ? "w-full" : ""}
        ${outline ? "bg-white" : "bg-green-600"}
        ${outline ? "border-blacky-light" : "border-none"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "p-2" : "py-2 px-6"}
        ${large && "py-4 px-6 rounded-md"}
        ${small ? "font-[400]" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
        ${!small && "mt-4"}

      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      {label}
    </button>
  );
};

export { Button };
