import Image from "next/image";
import { halfCircle } from "../../../public/assets/icons";
import React, { JSX } from "react";

interface ButtonTypes {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  loadinIcon?: string;
  className?: string;
  onClick?: () => void;
  iconClassName?: string;
}

const Button = React.forwardRef(function Button(
  {
    text,
    loading,
    disabled,
    loadinIcon,
    className,
    onClick,
    iconClassName,
  }: ButtonTypes,
  ref
): JSX.Element {
  return (
    <button
      className={` rounded all__trans flex items-center justify-center disabled:opacity-40 transition-transform duration-300 ${
        loading || disabled ? "" : "hover:scale-[1.01]"
      } ${
        className ||
        `w-full text-white px-6 py-[10px] font-semibold ${
          loading
            ? "bg-primary-default/60"
            : "bg-primary-default hover:bg-primary-default/80"
        }`
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <Image
          src={loadinIcon || halfCircle}
          className={`animate-spin mr-2 ${iconClassName}`}
          alt="spinner icon"
          width={18}
          height={18}
          priority={true}
        />
      )}
      <span>{text}</span>
    </button>
  );
});

export default Button;
