import React, { useState } from "react";
import SelectDropdown from "./SelectDropdown";
import Input from "./Input";
import { Controller } from "react-hook-form";

const DurationSelector = ({
  channelId,
  option,
  selectedItems,
  setSelectedItems,
  sliderValues,
  setSliderValues,
  control,
  name,
}: any) => {
  const handleDurationChange = (
    selectedOption: any,
    onChange: (value: string) => void
  ) => {
    let newDuration = "";
    const value =
      typeof selectedOption === "string"
        ? selectedOption
        : selectedOption.value;

    if (value === "quarterly") newDuration = "3 months";
    else if (value === "bi-quarterly") newDuration = "6 months";
    else if (value === "yearly") newDuration = "12 months";
    else {
      newDuration = ` ${value}`; // no number yet
    }

    setSelectedItems((prev: any) =>
      prev.map((item: any) =>
        item.channel === channelId && item.option === option
          ? { ...item, duration: newDuration }
          : item
      )
    );

    // reset slider duration too
    setSliderValues((prev: any) => ({
      ...prev,
      [`${channelId}-${option}`]: {
        ...prev[`${channelId}-${option}`],
        duration: 0,
      },
    }));

    onChange(newDuration); // Update form state
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const rawValue = e?.target?.value ?? ""; // ✅ safe access
    let value = parseInt(rawValue);

    if (!rawValue) {
      // user cleared input, keep empty in UI
      onChange("");
      return;
    }

    if (isNaN(value) || value < 1) {
      value = 1; // fallback
    }

    const currentItem = selectedItems.find(
      (item: any) => item.channel === channelId && item.option === option
    );
    const unit = currentItem?.duration.split(" ")[1] || "days";

    const newDuration = `${value} ${unit}`;

    setSelectedItems((prev: any) =>
      prev.map((item: any) =>
        item.channel === channelId && item.option === option
          ? { ...item, duration: newDuration }
          : item
      )
    );

    onChange(newDuration); // Update form state
  };

  const durationOptions = [
    { label: "Days", value: "days" },
    { label: "Weeks", value: "weeks" },
    { label: "Months", value: "months" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Bi-quarterly", value: "bi-quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const [selectedValue, selectedUnit] = value
          ? [parseInt(value.split(" ")[0]) || "", value.split(" ")[1] || ""]
          : ["", ""];

        return (
          <div className="pt-4">
            <label className="text-sm font-medium text-gray-700">
              Duration
            </label>
            <div className="flex gap-2 items-center mt-2">
              <SelectDropdown
                options={durationOptions}
                onChange={(selected: any) =>
                  handleDurationChange(selected, onChange)
                }
                placeholder="Select duration"
              />
              {["days", "weeks", "months"].includes(selectedUnit) && (
                <Input
                  type="number"
                  value={selectedValue === "" ? "" : selectedValue}
                  onChange={(e: any) => handleInputChange(e, onChange)}
                  min="1"
                  className="w-20"
                  placeholder="Enter number"
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default DurationSelector;
