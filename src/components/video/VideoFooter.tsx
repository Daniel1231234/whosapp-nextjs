import React from "react";
import { useAVToggle } from "@100mslive/react-sdk";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
  selectPeers,
} from "@100mslive/react-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  UserPlus,
  MessageSquare,
  SmileIcon,
  Cog,
  MoreHorizontal,
  ArrowRightIcon,
} from "lucide-react";
import Button from "../UI/Button";


function VideoFooter() {
  const peers = useHMSStore(selectPeers);
  const userCount = peers.length;
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo,
  } = useAVToggle();



  return (
    <div className="main_control flex flex-row max-w-fill h-[90px] bg-[#1C1E20] text-white p-2 justify-between">
      <div className="main_controls_section flex flex-row">
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center " onClick={toggleAudio}>
          {isLocalAudioEnabled ? (
            <>
              <Mic size={24} />
              <span className="button_name text-[14px] mt-2">Mute</span>
            </>
          ) : (
            <>
              <MicOff size={24} />
              <span className="button_name text-[14px] mt-2">Unmute</span>
            </>
          )}
        </div>

        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center" onClick={toggleVideo}>
          {isLocalVideoEnabled ? (
            <>
              <Video size={24} />
              <span className="button_name text-[14px] mt-2">Stop Video</span>
            </>
          ) : (
            <>
              <VideoOff size={24} />
              <span className="button_name text-[14px] mt-2">Start Video</span>
            </>
          )}
        </div>
      </div>

      <div className="main_controls_section flex flex-row">
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <div>
            <UserPlus size={24} />
            {userCount}
          </div>
          <span className="button_name text-[14px] mt-2">Participants</span>
        </div>
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <ArrowRightIcon size={24} />
          <span className="button_name text-[14px] mt-2">Share Screen</span>
        </div>
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <MessageSquare size={24} />
          <span className="button_name text-[14px] mt-2">Chat</span>
        </div>
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <SmileIcon size={24} />
          <span className="button_name text-[14px] mt-2">Reactions</span>
        </div>
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <Cog size={24} />
          <span className="button_name text-[14px] mt-2">Settings</span>
        </div>
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          <MoreHorizontal size={24} />
          <span className="button_name text-[14px] mt-2">More</span>
        </div>
      </div>

      <div className="main_controls_section flex flex-row">
        <div className="main_controls_button cursor-pointer flex flex-col py-1 px-2 min-w-[80px] items-center justify-center">
          {isConnected && (
            <Button
              id="leave-btn"
              className="btn-danger bg-[#f44336] text-white"
              onClick={() => hmsActions.leave()}
            >
              Leave
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoFooter;
