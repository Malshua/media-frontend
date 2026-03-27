"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import Select from "react-select";

export interface DropdownTypes {
  label: string | number;
  value: string | number | ReactNode;
}

export interface SelectDropdownTypes {
  defaultValue?: any;
  label?: string;
  labelClassName?: string;
  onChange?: any;
  styles?: string | any;
  disbaled?: boolean;
  options: { value: string | number | boolean; label: string }[];
  multiSelect?: any;
  textTransform?: string;
  error?: string | undefined;
  placeholder?: string;
  required?: boolean;
}

const SelectDropdown = React.forwardRef(function SelectDropdown(
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
    placeholder,
    required,
    ...rest
  }: SelectDropdownTypes,
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
      fontSize: "14px",
      textTransform: textTransform || "capitalize",
      zIndex: 9999,
      overflowY: "auto",
      scrollBehavior: "smooth",
      WebkitOverflowScrolling: "touch",
      overflow: "visible",
      backgroundColor: isDark ? "#1c1c1e" : provided.backgroundColor,
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : undefined,
      borderRadius: "8px",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: isDark ? "#6b7280" : "#868789",
    }),

    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      minHeight: "46px",
      fontSize: "14px",
      border: `1px solid ${state.isFocused ? "#A1238E" : isDark ? "rgba(255,255,255,0.12)" : "#E7EDF2"}`,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : provided.backgroundColor,
      borderRadius: "6px",
      textTransform: textTransform || "capitalize",
      boxShadow: state.isFocused ? "0 0 0 1px #A1238E" : "none",
      "&:hover": { borderColor: state.isFocused ? "#A1238E" : isDark ? "rgba(255,255,255,0.2)" : "#ccd1d9" },
    }),

    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
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
    <div>
      {label && (
        <div className="mb-1.5 flex items-center gap-2">
          <label
            className={`${labelClassName || "text-light-1"} text-left text-sm`}
          >
            {label}
          </label>

          {!required && <em className="text-xs"></em>}

          {required && (
            <span className="text-red-500 text-[8px]">
              <FaStarOfLife />
            </span>
          )}
        </div>
      )}

      {multiSelect ? (
        <Select
          isClearable
          isMulti
          components={{
            DropdownIndicator: () => (
              <span className="pr-4">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.101076 0.657184L4.75769 5.88725C4.89154 6.03758 5.10856 6.03758 5.24241 5.88725L9.8989 0.657184C10.1148 0.414655 9.96197 0 9.65651 0H0.343444C0.0380781 0 -0.114844 0.414671 0.101076 0.657184Z"
                    fill="#5F6B7A"
                  />
                </svg>
              </span>
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
      ) : (
        <Select
          isClearable
          components={{
            DropdownIndicator: () => (
              <span className="pr-4">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.101076 0.657184L4.75769 5.88725C4.89154 6.03758 5.10856 6.03758 5.24241 5.88725L9.8989 0.657184C10.1148 0.414655 9.96197 0 9.65651 0H0.343444C0.0380781 0 -0.114844 0.414671 0.101076 0.657184Z"
                    fill="#5F6B7A"
                  />
                </svg>
              </span>
            ),
            IndicatorSeparator: () => null,
          }}
          isDisabled={disbaled}
          defaultValue={defaultValue}
          onChange={onChange}
          styles={styles || selectCustomStyles}
          options={options}
          placeholder={placeholder || options?.[0]?.label}
          {...rest}
        />
      )}

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
});

export default SelectDropdown;
