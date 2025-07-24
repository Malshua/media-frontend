"use client";
import { DropdownIcon } from "@/utilities/DropdownIcon";
import React, { ReactNode } from "react";
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
  // select dropdown custom styles
  const selectCustomStyles = {
    menu: (provided: any) => ({
      ...provided,
      fontSize: "13px",
      textTransform: textTransform || "capitalize",
      zIndex: 100,
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#808080",
      fontSize: "13px",
    }),

    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      paddingLeft: leftIcon ? "32px" : "auto",
      minHeight: "43px",
      fontSize: "13px !important",
      border: `1px solid ${state.isFocused ? "#28A745" : "#D0D5DD"}`,
      color: "#E7EDF2",
      borderRadius: "4px",
      textTransform: textTransform || "capitalize",
    }),

    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      zIndex: 100,
      fontSize: "13px",
      backgroundColor: state.isSelected
        ? "#002366"
        : state.isFocused
        ? "#e6e9f0"
        : "",
    }),

    singleValue: (provided: any, state: { isDisabled: any }) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className={`${
            labelClassName || "text-gray-600"
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
