"use client";

import { useEffect } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import SignIn from "@/components/video/SignUpVideo";
import Footer from "@/components/video/VideoFooter";
import Conference from "@/components/video/Conference";

const Page = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  return (
    <div className=" ">
      {isConnected ? (
        <>
          <Conference />
          <Footer />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default Page;
