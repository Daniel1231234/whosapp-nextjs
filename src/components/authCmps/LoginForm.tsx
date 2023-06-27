import { UserLoginCred } from "@/types/typings";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import AppLogo from "../AppLogo";

interface LoginFormProps {
  handleCred: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  userCreds: UserLoginCred;
  setUserCreds: Dispatch<SetStateAction<UserLoginCred>>;
  setIsSign: any;
  loginWithFacebook: any;
  loginWithGoogle: any;
}
const LoginForm = ({
  handleCred,
  userCreds,
  setUserCreds,
  setIsSign,
  loginWithGoogle,
  loginWithFacebook,
}: LoginFormProps) => {
  return (
    <div className="w-full py-6 z-20">
      <h1 className="my-6">
        <span className="inline-flex">
          <AppLogo className="text-white " />
        </span>
      </h1>
      <div className="py-6 space-x-2">
        <span
          onClick={() => loginWithGoogle()}
          className="cursor-pointer w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white"
        >
          G
        </span>
        {/* <span
          onClick={() => loginWithFacebook()}
          className="cursor-pointer w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white"
        >
          f
        </span> */}
      </div>
      <p className="text-gray-100">use email to log in your account</p>
      <form
        className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
        onSubmit={(e) => handleCred(e)}
      >
        <div className="my-3 relative">
          <input
            className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
            value={userCreds.email}
            onChange={(e) =>
              setUserCreds({ ...userCreds, email: e.target.value })
            }
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 ml-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>

        <div className="relative my-3">
          <input
            className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            id="password"
            type="text"
            placeholder="Password"
            value={userCreds.password}
            onChange={(e) =>
              setUserCreds({ ...userCreds, password: e.target.value })
            }
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 ml-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          </div>
        </div>

        <div className="text-right text-gray-400 hover:underline hover:text-gray-100 cursor-pointer">
          <p onClick={() => setIsSign(false)}>Dont have an account?</p>
        </div>

        <div className="px-4 pb-2 pt-4">
          <button className="uppercase text-white block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
            {"Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
