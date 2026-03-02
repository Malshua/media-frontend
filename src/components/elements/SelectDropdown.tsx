"use client";
import React, { ReactNode } from "react";
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
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#868789",
    }),

    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      minHeight: "46px",
      fontSize: "14px",
      border: `1px solid ${state.isFocused ? "#28A745" : "#E7EDF2"}`,
      color: "#E7EDF2",
      borderRadius: "6px",
      textTransform: textTransform || "capitalize",
      // backgroundColor: "#e6e9f0",
    }),

    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
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
