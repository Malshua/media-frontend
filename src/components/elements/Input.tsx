import React, { InputHTMLAttributes, ReactNode } from "react";
import TooltipExtra from "./TooltipExtra";
import { FaStarOfLife } from "react-icons/fa";

interface InputTypes extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  max?: any;
  min?: any;
  bg?: string;
  value?: any;
  onChange?: any;
  error?: string | undefined;
  tooltip?: string;
  required?: boolean;
  right_icon?: ReactNode | string;
  left_icon?: ReactNode | string;
}

const Input = React.forwardRef(function Input(
  {
    type,
    label,
    placeholder,
    className,
    labelClassName,
    disabled,
    max,
    min,
    value,
    onChange,
    bg,
    error,
    tooltip,
    required,
    left_icon,
    right_icon,
    ...props
  }: InputTypes,
  ref: React.LegacyRef<HTMLInputElement> | undefined
) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center">
          {label && (
            <div className="text-sm flex items-center gap-2">
              <label
                className={`${labelClassName || "text-foreground"} text-left`}
              >
                {label}
              </label>

              {required ? (
                <span className="text-red-500 text-[8px]">
                  <FaStarOfLife />
                </span>
              ) : (
                ""
              )}
            </div>
          )}
          {tooltip && (
            <TooltipExtra
              content={<div className="w-52 text-xs py-2">{tooltip}</div>}
            />
          )}
        </div>
      )}

      <div
        className={`all__trans w-full border border-border focus-within:bg-background rounded text-sm md:text-base p-3 flex items-center gap-2 ${
          disabled && "bg-muted"
        } focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 dark:focus-within:ring-purple-900`}
      >
        {left_icon && <div>{left_icon}</div>}
        <input
          className={`w-full outline-0 all__trans text-sm placeholder:text-muted-foreground caret-foreground ${
            disabled ? "bg-muted" : "bg-transparent"
          }`}
          ref={ref}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          max={max}
          min={min}
          {...props}
        />
        {right_icon && (
          <div className="cursor-pointer text-muted-foreground">{right_icon}</div>
        )}
      </div>

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
});

export default Input;
