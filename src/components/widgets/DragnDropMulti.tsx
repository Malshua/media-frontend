import Image from "next/image";
import { LucideFileText } from "lucide-react";
import React from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { BsDot, BsTrash2 } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { truncateText } from "@/utilities/helpers";

export interface FileMetadata {
  name: string;
  size: string;
  uploadTime: string;
  uploadDate: string;
  file: File;
}

const DragnDropMulti = ({
  files,
  title,
  accept,
  onChange,
  onDelete,
}: {
  title: string;
  accept: string;
  onChange: any;
  files: FileMetadata[];
  onDelete: (index: number) => void;
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>

      {/* Upload Box (Always Visible) */}
      <div className="border-2 border-dashed flex flex-col justify-center items-center rounded-sm bg-white p-5 border-tertiary-gray relative border-[#A1238E]">
        <span className="text-4xl text-[#59044c]">
          <BiSolidCloudUpload />
        </span>
        <div className="font-semibold">Click to upload</div>
        <input
          className="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
          type="file"
          accept={accept}
          onChange={onChange}
          multiple // Allow multiple file uploads
          required
        />
      </div>
      <p className="mt-2 text-xs text-center">
        You can upload ”PDF”, “DOCx” , “JPEG”, Audio, Video file formats. <br />{" "}
        Shouldn&apos;t be above 300kb in size
      </p>

      {/* Display Uploaded Files */}
      {files?.length > 0 && (
        <div className="mt-5 space-y-3">
          {files?.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-2 border rounded-lg"
            >
              <div className="flex gap-5 items-center">
                <div className="bg-[#F1F5F9] p-3.5 rounded">
                  <LucideFileText className="text-[#171717]" />
                </div>
                <div className="text-xs flex flex-col gap-1">
                  <h1 className="font-medium text-xs">
                    {truncateText(file?.name, 40)}
                  </h1>
                  <div className="flex items-center text-[10px] gap-1 font-medium">
                    <span>{file?.uploadDate}</span> |{" "}
                    <span>{file?.uploadTime}</span> <BsDot />{" "}
                    <span>{file?.size}</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => onDelete(index)}
                className="cursor-pointer text-red-500 text-xl"
              >
                <CgTrash />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragnDropMulti;
