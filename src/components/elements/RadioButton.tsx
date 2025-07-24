"use client";
import React from "react";

const RadioButton = ({ id, name, label, selected, onChange }: any) => {
  return (
    <label className="flex items-center gap-2 border rounded py-3 px-3 cursor-pointer">
      <input
        type="radio"
        id={id}
        name={name}
        value={id}
        checked={selected === id}
        onChange={onChange}
        className="form-radio text-indigo-600"
      />
      <span>{label}</span>
    </label>
  );
};

export default RadioButton;
