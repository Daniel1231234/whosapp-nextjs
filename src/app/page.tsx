"use client";

import Link from "next/link";
import AppLogo from "@/components/AppLogo";
import { CldImage } from "next-cloudinary";

const Home = () => {
  return (
    <main className="container leading-normal tracking-normal text-gray-900 bg-gradient-to-r from-[#d53369] to-[#daae51] min-h-screen">
      <header className="w-full z-30 pt-4 top-0 left-0 text-gray-900 flex items-center justify-between">
        <AppLogo />
        <ul className="flex justify-end items-center">
          <li className="mr-3">
            <Link
              href="/login"
              className="h-10 px-4 py-2  bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center rounded-md font-medium"
            >
              {"Sign In"}
            </Link>
          </li>
        </ul>
      </header>
      <div className="pt-8 ">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4">
          <div className="w-full md:w-2/5 text-center md:text-left space-y-7">
            <h1 className="my-4 text-3xl md:text-5xl md:leading-tight font-bold">
              Chat with Friends and ChatGPT using WhosApp!
            </h1>
            <p className="mt-4 text-2xl leading-normal">
              Connect with your friends and engage in conversations powered by
              ChatGPT, an AI language model. Stay connected and chat like never
              before!
            </p>
            <Link
              href="/login"
              className="h-10 px-4 py-2 text-lg bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center rounded-md font-medium"
            >
              Get Started with WhosApp!
            </Link>
          </div>
          <CldImage
            priority
            width="350"
            height="350"
            preserveTransformations
            sizes="(min-width: 500px) 50vw,
                     (min-width: 728px) 33vw,
                     (min-width: 976px) 25vw,
                      100vw"
            className="rounded-full opacity-80"
            src="https://res.cloudinary.com/dshctr/image/upload/v1687950043/hero_pzkic5.jpg"
            alt="Hero"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
