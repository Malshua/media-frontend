import React from "react";
import { motion } from "framer-motion";

function SmoothSlider({
  value,
  setValue,
  fullAmount,
  type = "amount",
}: {
  value: number;
  setValue: (value: number) => void;
  fullAmount: number;
  type?: "amount" | "duration";
}) {
  const min = 0;
  const max = 100;
  const actualValue = (value / 100) * fullAmount;

  const clampedValue = Math.min(Math.max(value, 5), 95);

  const formatLabel = () => {
    if (type === "amount") {
      return actualValue.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      });
    } else {
      return `${Math.round(actualValue)} days`;
    }
  };

  return (
    <div className="w-full mx-auto mt-3">
      <div className="relative">
        {value > 0 && (
          <motion.div
            initial={false}
            animate={{ left: `${clampedValue}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute -top-6 transform -translate-x-1/2 text-sm font-medium bg-white px-3 py-1 rounded-md shadow"
          >
            {formatLabel()}
          </motion.div>
        )}

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full appearance-none h-2 bg-gray-200 rounded-full outline-none 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:border 
            [&::-webkit-slider-thumb]:border-gray-800 
            [&::-webkit-slider-thumb]:shadow 
            [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0f172a ${value}%, #e5e7eb ${value}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500 mt-3">
        {type === "amount" ? (
          <>
            <span>₦0</span>
            <span>₦1M</span>
          </>
        ) : (
          <>
            <span>0</span>
            <span>30 days</span>
          </>
        )}
      </div>
    </div>
  );
}

export default SmoothSlider;
