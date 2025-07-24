"use client";
import { Typography } from "@material-tailwind/react";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps
  extends Omit<
    React.ComponentProps<typeof PhoneInput>,
    "country" | "countryCodeEditable"
  > {
  className?: string;
  label?: string;
  error?: string;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="mb-1 font-medium text-gray-800 text-sm">
          {label}
        </label>
      )}

      <PhoneInput
        country={"ng"}
        countryCodeEditable={false}
        containerClass="all__trans text-left h-11 bg-transparent border focus-within:border-maj-blue rounded"
        inputClass={`w-full p-5 ${className}`}
        inputStyle={{
          width: "100%",
          background: "transparent",
          height: "100%",
          marginLeft: "10px",
          marginRight: "-10px",
        }}
        buttonClass="w-12"
        dropdownClass="w-12"
        {...props}
      />

      {error && (
        <p className="ml-1 text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CustomPhoneInput;
