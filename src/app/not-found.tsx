"use client";

import { Routes } from "@/utilities/routes";
import Link from "next/link";

function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        Sorry Chief, the page you&apos;re looking for doesn’t exist.
      </p>
      <div>
        {" "}
        Go to{" "}
        <Link
          href={Routes?.DASHBOARD}
          className="font-semibold hover:underline cursor-default transition-all ease-in-out duration-400"
        >
          Dashboard
        </Link>{" "}
        or try to{" "}
        <Link
          href={Routes?.LOGIN}
          className="font-semibold hover:underline cursor-default transition-all ease-in-out duration-400"
        >
          Login
        </Link>{" "}
        again 😊
      </div>
    </div>
  );
}

export default NotFound;
