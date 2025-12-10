import React, { ReactNode } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface ModalTypes {
  children: ReactNode;
  open: boolean;
  openModal?: any;
  closeBtn?: boolean;
  backgroundColor?: string;
}

const Modal = ({
  children,
  open,
  openModal,
  closeBtn,
  backgroundColor,
}: ModalTypes) => {
  return (
    <>
      {open && (
        <div
          className={`
  fixed 
  top-1/2 left-1/2 
  -translate-x-1/2 -translate-y-1/2
  z-[500]
  w-11/12 md:w-fit
  h-fit
  rounded-lg 
  p-4
  ${backgroundColor || "bg-primary-soft"}
`}
        >
          {closeBtn && (
            <div className="flex justify-end">
              <button
                className="text-2xl text-primary-default"
                onClick={openModal}
              >
                <IoMdCloseCircle />
              </button>
            </div>
          )}
          <div>{children}</div>
        </div>
      )}

      {open && (
        <div
          onClick={openModal}
          className="fixed bottom-0 left-0 top-0 z-[400] h-full w-full bg-dark-1/40"
        />
      )}
    </>
  );
};

export default Modal;
