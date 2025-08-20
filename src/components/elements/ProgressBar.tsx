import React from "react";

interface ProgressBarProps {
  value: number; // value between 0 and 100
  height?: string; // e.g. "h-3", "h-2.5"
  color?: string; // e.g. "bg-blue-600"
  backgroundColor?: string; // e.g. "bg-gray-200"
}

const ProgressBar = ({
  value,
  height = "h-2",
  color = "bg-[#A1238E]",
  backgroundColor = "bg-gray-200",
}: ProgressBarProps) => {
  const clampedValue = Math.max(0, Math.min(100, value)); // Ensure 0-100

  return (
    <div className={`w-[60%] ${height} ${backgroundColor} rounded-full`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-300`}
        style={{ width: `${clampedValue}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
