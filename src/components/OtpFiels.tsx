import React, { FC, useRef } from "react";

interface OTPInputProps {
  otp: string;
  onChange: (otp: string) => void;
  isDisabled?: boolean;
}

const OTPInput: FC<OTPInputProps> = ({ otp, onChange, isDisabled = false }) => {
  const inputs = useRef<HTMLInputElement[]>([]);

  // Function to handle changes in input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = otp.split("");
      newOtp[index] = value;
      onChange(newOtp.join(""));
      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  // Function to handle keydown events for navigation and restriction
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (index > 0 && !inputs.current[index]?.value) {
        // Move focus to the previous input if current input is empty
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move focus to the previous input on left arrow key
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move focus to the next input on right arrow key
      inputs.current[index + 1]?.focus();
    } else if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      // Prevent non-numeric keys
      e.preventDefault();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      onChange(pasteData);
    } else if (/^\d{1,4}$/.test(pasteData)) {
      const newOtp = otp.split("");

      pasteData.split("").forEach((char, i) => {
        if (i < 4) newOtp[i] = char;
      });
      onChange(newOtp.join(""));
    }
  };

  const setRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
      inputs.current[index] = el;
    }
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          inputMode="numeric"
          ref={(el) => setRef(el, index)}
          type="text"
          maxLength={1}
          value={otp[index] || ""}
          onPaste={(e) => handlePaste(e, index)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isDisabled}
          className="w-9 h-9 sm:w-12 sm:h-12 text-center text-xl border border-gray-300 rounded"
        />
      ))}
    </div>
  );
};

export { OTPInput };
