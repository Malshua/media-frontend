"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SelectDateTypes {
  label?: string;
  label2?: any;
  placeholder?: string;
  onChange?: any;
  selectedDate?: Date | undefined;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: string | undefined;
  required?: boolean;
  disabled?: boolean;
}

const SelectDate = ({
  label,
  label2,
  placeholder,
  onChange,
  selectedDate,
  dateFormat,
  minDate,
  maxDate,
  error,
  required,
  disabled,
  ...fields
}: SelectDateTypes) => {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center gap-2 text-sm">
          <div className="text-sm flex items-center gap-1">
            <label className="text-gray-600 font-medium">{label}</label>
            {required && <span className="text-red-500">*</span>}
          </div>
          {!required && <em className="text-xs "></em>}

          {label2 && <div>{label2}</div>}
        </div>
      )}

      <div>
        <DatePicker
          className="!w-full text-sm border border-gray-300 rounded px-3 py-3 placeholder:text-sm"
          onChange={onChange}
          selected={selectedDate}
          placeholderText={placeholder}
          dateFormat={dateFormat || "dd MMMM, yyyy"}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          showYearDropdown
          {...fields}
        />
      </div>

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default SelectDate;
