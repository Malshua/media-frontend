"use client";
import React, { InputHTMLAttributes } from "react";

interface CustomInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const CLASSES = {
  base: "border rounded p-2.5 w-full outline-none transition-all duration-200 text-sm",
  default: "border-gray-300",
  focus: "focus:border-maj-blue",
  error: "border-red-500",
  disabled: "bg-gray-50 cursor-not-allowed",
  label: "mb-1 font-medium text-gray-800 text-sm",
  errorText: "ml-1 text-red-500 text-xs mt-1 font-medium",
  iconWrapper: "absolute top-1/2 -translate-y-1/2",
  inputWithIcon: "pl-10",
  wrapper: "relative",
} as const;

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      className = "",
      wrapperClassName = "",
      labelClassName = "",
      errorClassName = "",
      icon,
      rightIcon,
      maxLength = 20,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputClassName = `
      ${CLASSES.base}
      ${error ? CLASSES.error : `${CLASSES.default} ${CLASSES.focus}`}
      ${disabled ? CLASSES.disabled : ""}
      ${className}
      ${icon ? CLASSES.inputWithIcon : ""}
    `.trim();

    return (
      <div className={`${CLASSES.wrapper} ${wrapperClassName}`}>
        {label && (
          <label className={`${CLASSES.label} ${labelClassName}`}>
            {label}
          </label>
        )}

        <div className={CLASSES.wrapper}>
          {icon && (
            <div className={`${CLASSES.iconWrapper} left-3`}>{icon}</div>
          )}

          <input
            ref={ref}
            maxLength={maxLength}
            disabled={disabled}
            className={inputClassName}
            {...props}
          />

          {rightIcon && (
            <div className={`${CLASSES.iconWrapper} right-3`}>{rightIcon}</div>
          )}
        </div>

        {error && (
          <p className={`${CLASSES.errorText} ${errorClassName}`}>{error}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
