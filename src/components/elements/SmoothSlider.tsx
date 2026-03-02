import React from "react";
import { motion } from "framer-motion";

function SmoothSlider({
  value,
  setValue,
  min,
  max,
  step,
  type = "amount",
}: {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  type?: "amount" | "duration";
}) {
  const clampedValue = Math.min(Math.max(value, min), max);
  // Calculate percentage for the slider's visual fill
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const formatLabel = () => {
    if (type === "amount") {
      return (clampedValue * 1500).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      });
    } else {
      return `${Math.round((clampedValue / 100) * 30)} days`;
    }
  };

  return (
    <div className="w-full mx-auto mt-3">
      <div className="relative">
        {value > min && (
          <motion.div
            initial={false}
            animate={{ left: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute -top-6 transform -translate-x-1/2 text-sm font-medium bg-card px-3 py-1 rounded-md shadow"
          >
            {formatLabel()}
          </motion.div>
        )}

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full appearance-none h-2 bg-muted rounded-full outline-none 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:bg-background 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:border 
            [&::-webkit-slider-thumb]:border-foreground 
            [&::-webkit-slider-thumb]:shadow 
            [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--foreground) ${percentage}%, var(--muted) ${percentage}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-muted-foreground mt-3">
        {type === "amount" ? (
          <>
            <span>₦15,000</span>
            <span>₦150,000,000</span>
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
