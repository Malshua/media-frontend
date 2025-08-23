"use client";

import {
  getFileURL,
  getFirstLetters,
  getFullDate,
  textReplacer,
} from "@/utilities/helpers";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuthActions";
import { Routes } from "@/utilities/routes";

const ArrowBackIcon = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 12.4918H4M4 12.4918L7 9.49182M4 12.4918L7 15.4918"
      stroke="#1E88E5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 12.4918C20 10.3701 19.1571 8.33526 17.6569 6.83497C16.1566 5.33468 14.1217 4.49182 12 4.49182M12 20.4918C13.1994 20.4929 14.3837 20.2238 15.4648 19.7044C16.546 19.185 17.4962 18.4288 18.245 17.4918"
      stroke="#1E88E5"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface userTypes {
  name: any;
  email: any;
  avatar: any;
  agent_code: string;
  acctstatus: string;
  kyc_status: string;
}

const UserModal = ({
  image_url,
  name_initials,
  user,
}: {
  image_url: string;
  name_initials: string;
  user: any;
}) => {
  const DetailsItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | ReactNode;
  }) => {
    return (
      <div className="text-[#2E353A] grid grid-cols-2 gap-5">
        <div className="mb-1 text-sm font-semibold capitalize">
          {textReplacer(label, "_")}
        </div>
        <div className="text-xs sm:text-sm text-[#A8B5CC] capitalize">
          {value || "N/A"}
        </div>
      </div>
    );
  };

  const account_details = useMemo(() => {
    const info: any = {
      reg_date: getFullDate(user?.createdAt),
      status: user?.acctstatus,
      //   no_onboarded: user?.contact?.email,
    };

    return info;
  }, [user]);

  return (
    <div className="absolute top-28 right-0 lg:left-80 z-50 w-80 lg:w-96 shadow-lg border rounded-lg bg-white cursor-default">
      <div className="py-6 px-8 flex flex-col gap-8">
        <div>
          {user ? (
            <div className="w-20 h-20 mx-auto">
              <Image
                src={image_url}
                className="w-20 h-20 rounded-full border border-secondary-default object-cover"
                width={80}
                height={80}
                alt="profile photo"
              />
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary-default text-white text-2xl flex items-center justify-center uppercase font-semibold">
              {name_initials}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-1 text-center">
            <span className="text-primary-light font-semibold capitalize">
              {user?.name}
            </span>
            <span className="text-primary-gray text-xs font-medium">
              {user?.agent_code}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {Object.keys(account_details).map((key, index) => (
            <DetailsItem key={index} label={key} value={account_details[key]} />
          ))}
        </div>

        <Link
          href={Routes.LOGOUT}
          className="px-5 py-1.5 flex items-center gap-2 border border-secondary-default w-fit mx-auto rounded-md"
        >
          <span className="text-[#A1238E] font-medium">Log Out</span>
          <ArrowBackIcon />
        </Link>
      </div>
    </div>
  );
};

const UserBadge = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();

  // open and close user modal
  const openUserModal = () => {
    setOpenModal(!openModal);
  };

  const closeUserModal = () => {
    setOpenModal(false);
  };

  const name_initials = getFirstLetters(user?.name);

  return (
    <div>
      <Link
        href={Routes.PROFILE}
        // onClick={openUserModal}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* {user?.picture ? (
          <div className="w-12 h-12">
            <Image
              src={getFileURL(user?.picture)}
              className="w-12 h-12 rounded-full border border-secondary-default object-cover"
              width={52}
              height={52}
              alt="profile photo"
            />
          </div>
        ) : ( */}
        <div className="w-16 h-16 rounded-full border border-[#A1238E] bg-secondary-default text-[#A1238E] text-xl flex items-center justify-center uppercase font-semibold">
          {name_initials}
        </div>
        {/* )} */}
        {/* <div className="flex flex-col gap-1 leading-5">
          <span className="text-sm text-primary-light font-semibold capitalize">
            {user?.name}
          </span>
          <span className="text-primary-gray text-xs font-medium">
            {user?.email}
          </span>
        </div> */}
      </Link>

      {/* {openModal && (
        <>
          <UserModal
            image_url={image_url}
            name_initials={name_initials}
            user={user}
          />

          <div
            onClick={closeUserModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-40"
          />
        </>
      )} */}
    </div>
  );
};

export default UserBadge;
