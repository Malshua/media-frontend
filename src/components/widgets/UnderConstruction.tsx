import Image from "next/image";
import React from "react";
import { construction } from "../../../public/assets/images";

interface UnderConstructionTypes {
  text?: string;
  src?: string | any;
  imgWidth?: any;
  imgHeight?: any;
}

const UnderConstruction = ({
  src,
  text,
  imgWidth,
  imgHeight,
}: UnderConstructionTypes) => {
  return (
    <div className="py-10 flex flex-col items-center justify-center">
      <div className="text-8xl text-center">
        <Image
          src={src || construction}
          width={imgWidth}
          height={imgHeight}
          alt="under construction image"
        />
      </div>
      <div className="mt-5 text-center text-xl leading-6 w-72 mx-auto text-primary-default font-semibold">
        {text || "Coming Soon!"}
      </div>
    </div>
  );
};

export default UnderConstruction;
