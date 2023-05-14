"use client";

import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import ProvidersAuth from "@/components/authCmps/ProvidersAuth";
import Image from "next/image";
import {  UserLoginCred } from "@/types/typings";
import LoginForm from "@/components/authCmps/LoginForm";
import SignupForm from "@/components/authCmps/SignupForm";
import ButtonToggleDarkMode from "@/components/ToggleDarkMode";

const Page: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSign, setIsSign] = useState<boolean>(true);
  const [userCred, setUserCreds] = useState<UserLoginCred>({
    email: "",
    password: "",
  });

  const handleCred = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (userCred.email === "" || userCred.password === "") {
        toast.error("Something went wrong with your credentails :(");
        return;
      }
      await signIn("credentials", {
        email: userCred.email,
        password: userCred.password,
        // redirect: true,
      });
    } catch (err) {
      toast.error("Something went wrong with your login.");
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong with your login.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      await signIn("facebook");
    } catch (error) {
      toast.error("Something went wrong with your login.");
    }
  };

  return (
    <>
     <ButtonToggleDarkMode className="absolute top-2 right-2" />
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Image src="/logo.png" alt="" width={150} height={150} priority />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Welcome to WhosApp!
            </h2>
          </div>
          {isSign ? (
            <>
              <LoginForm
                handleCred={handleCred}
                userCreds={userCred}
                setUserCreds={setUserCreds}
              />
              <div className="border border-collapse w-full"></div>
              <ProvidersAuth
                isLoading={isLoading}
                loginWithFacebook={loginWithFacebook}
                loginWithGoogle={loginWithGoogle}
              />
              <p className="text-center mt-4 text-gray-600">
                {"Don't have an account?"}
                <button
                  className="text-blue-500"
                  onClick={() => setIsSign(false)}
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <SignupForm setIsSign={setIsSign} isSign={isSign} />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
