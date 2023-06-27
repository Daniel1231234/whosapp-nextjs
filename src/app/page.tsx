import Link from "next/link";
import Image from "next/image";
import AppLogo from "@/components/AppLogo";

const Home = () => {
  return (
    <main className="leading-normal tracking-normal text-gray-900 bg-gradient-to-r from-[#d53369] to-[#daae51] min-h-screen">
      <header className="w-full z-30 top-0 left-0 text-gray-900 flex items-center justify-between">
        <AppLogo />
        <ul className="flex justify-end items-center">
          <li className="mr-3">
            <Link
              href="/login"
              className="h-10 py-2 px-4 bg-slate-900 text-white hover:bg-slate-800 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {"Sign In"}
            </Link>
          </li>
        </ul>
      </header>
      <div className="pt-20">
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
              className="h-10 my-4 px-4 bg-slate-900 text-white hover:bg-slate-800 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              Get Started with WhosApp!
            </Link>
          </div>
          <div className="py-6 w-[350px] h-[350px] text-center relative">
            <Image
              fill
              sizes="60vw"
              priority
              className="rounded-full opacity-80 mx-auto"
              src="/hero.jpg"
              alt="Hero"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
