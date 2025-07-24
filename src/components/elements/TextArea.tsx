import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaTypes extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  max?: any;
  error?: string | undefined;
  className?: string;
  required?: boolean;
  labelClassName?: string;
}

const TextArea = React.forwardRef(function TextArea(
  {
    label,
    placeholder,
    disabled,
    max,
    error,
    className,
    required,
    labelClassName,
    ...props
  }: TextAreaTypes,
  ref: React.LegacyRef<HTMLTextAreaElement> | undefined,
) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center">
          {label && (
            <div className="flex items-center gap-0.5 text-sm">
              <label
                className={`${labelClassName || 'text-[#2D3748]'} text-left`}
              >
                {label}
              </label>

              {required && <span className="text-red-500">*</span>}
            </div>
          )}
          {/* {tooltip && (
            <TooltipExtra
              content={<div className="w-52 text-xs py-2">{tooltip}</div>}
            />
          )} */}
        </div>
      )}

      <textarea
        className={`all__trans w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-default focus:outline-0 ${
          disabled ? 'bg-gray-200' : 'bg-transparent'
        } ${className || 'h-32'}`}
        ref={ref}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />

      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
});

export default TextArea;
