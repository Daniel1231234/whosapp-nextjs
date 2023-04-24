"use client";

import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { HMSRoomProvider } from "@100mslive/react-sdk";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <HMSRoomProvider>{children}</HMSRoomProvider>
    </>
  );
};

export default Providers;
