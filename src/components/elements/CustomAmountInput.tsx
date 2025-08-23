import React, { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import TooltipExtra from "./TooltipExtra";
import { FaStarOfLife } from "react-icons/fa";

interface InputTypes extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  other_label?: ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  max?: number;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // Ensure it expects an event
  error?: string;
  tooltip?: string;
  required?: boolean;
  right_icon?: ReactNode;
  left_icon?: ReactNode;
}

export const handleFormattedNumber = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
) => {
  let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

  if (rawValue === "") {
    onChange({ ...e, target: { ...e.target, value: "" } }); // Allow clearing the input
    return;
  }

  onChange({ ...e, target: { ...e.target, value: rawValue } });
};

const CustomAmountInput = React.forwardRef<HTMLInputElement, InputTypes>(
  (
    {
      label,
      other_label,
      placeholder,
      className,
      labelClassName,
      inputClassName,
      disabled,
      max,
      value,
      onChange,
      error,
      tooltip,
      required,
      left_icon,
      right_icon,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
      const formattedValue = Number(rawValue).toLocaleString(); // Add commas
      e.target.value = formattedValue; // Show formatted value
      onChange?.({
        ...e,
        target: { ...e.target, value: rawValue },
      } as ChangeEvent<HTMLInputElement>); // Store raw value
    };

    return (
      <div>
        {label && (
          <div className="mb-2 flex items-center justify-between gap-5">
            <div className="flex items-center">
              <div className="text-sm flex items-center gap-2">
                <label
                  className={`${labelClassName || "text-light-1"} text-left`}
                >
                  {label}
                </label>
                {required && (
                  <span className="text-red-500 text-[8px]">
                    <FaStarOfLife />
                  </span>
                )}
              </div>
              {tooltip && (
                <TooltipExtra
                  content={
                    <div className="w-52 text-xs py-2 leading-5">{tooltip}</div>
                  }
                />
              )}
            </div>
            {other_label && <>{other_label}</>}
          </div>
        )}

        <div
          className={`all__trans w-full border border-gray-300 focus-within:border-primary-default focus-within:bg-white rounded text-sm md:text-base px-3 py-2.5 flex items-center gap-2 ${
            disabled ? "bg-gray-100" : ""
          }`}
        >
          {left_icon && <div>{left_icon}</div>}
          <input
            className={`w-full outline-0 all__trans text-sm ${
              disabled ? "bg-gray-100" : "bg-transparent"
            } ${inputClassName}`}
            ref={ref}
            value={value}
            onChange={handleChange}
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            max={max}
            {...props}
          />
          {right_icon && <div className="cursor-pointer">{right_icon}</div>}
        </div>

        {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
      </div>
    );
  }
);

CustomAmountInput.displayName = "CustomAmountInput";

export default CustomAmountInput;
