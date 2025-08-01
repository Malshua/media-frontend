import React from "react";
import { FaStarOfLife } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface InputTypes {
  label?: string;
  other_label?: any;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | undefined;
  required?: boolean;
}

const TelephoneInput = ({
  label,
  other_label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  required,
  ...props
}: InputTypes) => {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center gap-2 text-sm">
          <label className="text-gray-600 font-medium">{label}</label>

          {!required && <em className="text-xs"></em>}

          {required && (
            <span className="text-red-500 text-[8px]">
              <FaStarOfLife />
            </span>
          )}
        </div>
      )}

      <div
        className={`all__trans w-full border border-gray-300 focus-within:border-primary-default focus-within:bg-white rounded text-sm md:text-base p-3 flex items-center gap-2 ${
          disabled && "bg-gray-200"
        }`}
      >
        <PhoneInput
          className={`w-full all__trans text-sm ${
            disabled ? "bg-gray-200" : "bg-transparent"
          }`}
          value={value}
          onChange={onChange}
          defaultCountry="NG"
          placeholder={placeholder || "Enter phone number"}
          disabled={disabled}
          {...props}
        />
      </div>

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default TelephoneInput;
