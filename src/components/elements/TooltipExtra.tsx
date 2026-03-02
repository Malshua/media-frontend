"use client";
import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import { infoOrange } from "../../../public/assets/icons";

const TooltipExtra = ({ content, imgSrc }: any) => {
  return (
    <div className="mx-1">
      <Tooltip content={content}>
        <button className="h-4 w-2 flex items-center justify-center">
          <Image
            src={imgSrc || infoOrange}
            alt="info icon"
            width={4}
            height={9}
            priority={true}
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default TooltipExtra;
