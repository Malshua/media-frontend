import Image from 'next/image';
import React from 'react';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { pdfimage } from '../../../public/assets/images';
import { BsDot } from 'react-icons/bs';

const DragnDrop = ({
  files,
  title,
  accept,
  onChange,
}: {
  title: string;
  accept: string;
  onChange: any;
  files: any;
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {!files.name ? (
        <>
          {' '}
          <div className="border-2 border-dashed flex flex-col justify-center items-center rounded-sm bg-white p-5 border-tertiary-gray relative border-[#33C3E0]">
            <span className="text-4xl text-[#8CBCD6] ">
              <BiSolidCloudUpload />
            </span>
            <div className="font-semibold">Click to upload</div>
            <input
              className="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
              type="file"
              accept={accept}
              onChange={onChange}
              required
            />
          </div>
          <p className="mt-2 text-xs">
            You can upload PDF, DOCX , and “JPEG” file formats. (Not more than
            400kb)
          </p>
        </>
      ) : (
        <>
          <div>
            <div className="flex items-center gap-4 mt-2">
              <Image src={pdfimage} alt="pdf logo" width={44} height={48} />
              <div className="text-xs flex flex-col gap-1">
                <h1 className="font-medium text-sm">{files.name}</h1>
                <div className="flex items-center gap-1">
                  <span>{files.uploadDate}</span> |{' '}
                  <span>{files.uploadTime}</span> <BsDot />{' '}
                  <span>{files.size}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DragnDrop;
