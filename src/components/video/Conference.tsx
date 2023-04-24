import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import React from "react";
import Peer from "./Peer";

const Conference = () => {
  const peers = useHMSStore(selectPeers);

  return (
    <div className="room-section bg-gray-600 w-full h-auto">
      <div className="conference-section py-5 px-7 h-[700px] my-0 mx-auto text-white">
        <div className="peers-container grid grid-cols-2 auto-cols-min justify-items-center gap-2 mt-[60px]">
          {peers.map((peer) => (
            <Peer key={peer.id} peer={peer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conference;
