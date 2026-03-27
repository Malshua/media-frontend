"use client";
import { DropdownIcon } from "@/utilities/DropdownIcon";
import React, { ReactNode, useEffect, useState } from "react";
import Select from "react-select";

export interface DropdownTypes {
  label: string;
  value: string | number | ReactNode;
}

interface CustomSelectTypes {
  defaultValue?: any;
  label?: string;
  labelClassName?: string;
  onChange?: any;
  styles?: string | any;
  disbaled?: boolean;
  options: { value: string | number; label: string }[];
  multiSelect?: any;
  textTransform?: string;
  error?: string | undefined;
  icon?: number;
  leftIcon?: ReactNode;
  placeholder?: string;
}

const CustomSelect = React.forwardRef(function CustomSelect(
  {
    label,
    labelClassName,
    defaultValue,
    onChange,
    styles,
    disbaled,
    options,
    multiSelect,
    textTransform,
    error,
    icon,
    leftIcon,
    placeholder,
    ...rest
  }: CustomSelectTypes,
  ref
) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // select dropdown custom styles
  const selectCustomStyles = {
    menu: (provided: any) => ({
      ...provided,
      fontSize: "13px",
      textTransform: textTransform || "capitalize",
      zIndex: 100,
      backgroundColor: isDark ? "#1c1c1e" : provided.backgroundColor,
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : undefined,
      borderRadius: "8px",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: isDark ? "#6b7280" : "#808080",
      fontSize: "13px",
    }),

    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      paddingLeft: leftIcon ? "32px" : "auto",
      minHeight: "43px",
      fontSize: "13px !important",
      border: `1px solid ${state.isFocused ? "#A1238E" : isDark ? "rgba(255,255,255,0.12)" : "#D0D5DD"}`,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : provided.backgroundColor,
      borderRadius: "4px",
      textTransform: textTransform || "capitalize",
      boxShadow: state.isFocused ? "0 0 0 1px #A1238E" : "none",
      "&:hover": { borderColor: state.isFocused ? "#A1238E" : isDark ? "rgba(255,255,255,0.2)" : "#b5bbc5" },
    }),

    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      zIndex: 100,
      fontSize: "13px",
      backgroundColor: state.isSelected
        ? "#A1238E"
        : state.isFocused
        ? isDark ? "rgba(255,255,255,0.08)" : "#e6e9f0"
        : isDark ? "#1c1c1e" : "",
      color: state.isSelected ? "#fff" : isDark ? "#e5e5e5" : provided.color,
    }),

    singleValue: (provided: any, state: { isDisabled: any }) => ({
      ...provided,
      opacity: state.isDisabled ? 0.5 : 1,
      transition: "opacity 300ms",
      color: isDark ? "#f5f5f5" : provided.color,
    }),

    input: (provided: any) => ({
      ...provided,
      color: isDark ? "#f5f5f5" : provided.color,
    }),

    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? "rgba(161,35,142,0.25)" : "#e6e9f0",
    }),

    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDark ? "#e5e5e5" : provided.color,
    }),

    multiValueRemove: (provided: any) => ({
      ...provided,
      color: isDark ? "#a3a3a3" : provided.color,
      ":hover": { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ffbdad", color: isDark ? "#fff" : "#de350b" },
    }),

    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: isDark ? "#6b7280" : provided.color,
    }),
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className={`${
            labelClassName || "text-muted-foreground"
          } block mb-2 text-left text-sm`}
        >
          {label}
        </label>
      )}

      {multiSelect ? (
        <div className="w-full flex gap-2 items-center">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-[50%] z-50 text-lg text-dark">
              {leftIcon}
            </div>
          )}
          <div className="flex-1">
            <Select
              isMulti
              components={{
                DropdownIndicator: () => (
                  <span className="pr-4">{DropdownIcon(icon || 1)}</span>
                ),
                IndicatorSeparator: () => null,
              }}
              isDisabled={disbaled}
              defaultValue={defaultValue}
              onChange={onChange}
              styles={styles || selectCustomStyles}
              options={options}
              {...rest}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full flex gap-2 items-center">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-[50%] z-50 text-lg text-dark">
              {leftIcon}
            </div>
          )}
          <div className="relative flex-1">
            <Select
              components={{
                DropdownIndicator: () => (
                  <span className="pr-4">{DropdownIcon(icon || 1)}</span>
                ),
                IndicatorSeparator: () => null,
              }}
              placeholder={placeholder || options?.[0]?.label}
              isDisabled={disbaled}
              defaultValue={defaultValue}
              onChange={onChange}
              styles={styles || selectCustomStyles}
              options={options}
              {...rest}
            />
          </div>
        </div>
      )}

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
});

export default CustomSelect;
