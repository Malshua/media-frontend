"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Routes } from "@/utilities/routes";
import { media_logo } from "../../public/assets/images";
import { useRouter } from "next/navigation";

const Error = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Internal Server Error </title>
      </Head>

      <main>
        <section className="p-8">
          <article className="mb-5">
            <Link href={Routes.DASHBOARD}>
              <Image
                src={media_logo}
                alt="icon"
                width={100}
                height={100}
                priority={true}
              />
            </Link>
          </article>

          <article className="text-center">
            <h2 className="mb-1 text-primary text-2xl font-bold">
              Internal Server Error
            </h2>

            <div className="mb-8">
              Hello, we&apos;re sorry this happened but the fault isn&apos;t
              yours, it is ours😓.
              <br /> Try accessing the page later.
            </div>

            <div className="w-fit mx-auto">
              <button
                onClick={() => router.refresh()}
                className="block w-full py-2 px-8 bg-primary text-white text-center rounded-lg"
              >
                Try again
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Error;
