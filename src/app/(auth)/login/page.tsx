"use client";

import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import ProvidersAuth from "@/components/authCmps/ProvidersAuth";
import Image from "next/image";

const Page: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Image src="/logo.png" alt="" width={150} height={150} />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Sign in to your account
            </h2>
          </div>
          <ProvidersAuth
            isLoading={isLoading}
            loginWithFacebook={loginWithFacebook}
            loginWithGoogle={loginWithGoogle}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
