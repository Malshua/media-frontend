"use client";

import React, { ReactNode } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalTypes {
  children: ReactNode;
  open: boolean;
  openModal?: () => void;
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
    <Dialog open={open} onOpenChange={openModal}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-dark-1/40 z-40" />
        <DialogContent
          className={`fixed z-50 w-full sm:max-w-xl max-h-[70vh] overflow-y-auto rounded-lg p-6 shadow-lg scrollbar-hide ${
            backgroundColor || "bg-white"
          }`}
        >
          {/* {closeBtn && (
            <div className="flex justify-end mb-2">
              <button
                className="text-2xl text-primary-default"
                onClick={openModal}
              >
                <IoMdCloseCircle />
              </button>
            </div>
          )} */}
          <div>{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
