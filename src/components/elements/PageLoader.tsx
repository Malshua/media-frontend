"use client";
import Image from "next/image";
import React from "react";

const PageLoader = ({ loadingText, className }: any) => {
  return (
    <section className="w-auto flex items-center justify-center">
      <div
        className={`flex items-center justify-center ${className} flex-col relative`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-ping p-8 flex items-center justify-center">
            {/* <Image
              src={defaultImage}
              height={20}
              width={20}
              alt="logo"
            /> */}
          </div>
          <svg
            className="animate-spin h-16 w-16 text-primary-default absolute"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#1E88E5"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill=" #1E88E5"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h3 className="text-sm pt-7">{loadingText || "Loading Information"}</h3>
      </div>
    </section>
  );
};

export default PageLoader;
