'use client'

import { pusher } from "@/lib/pusher";
import { useEffect, useRef, useState } from "react";
import SimplePeer from 'simple-peer';


const VideoCall = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [otherUser, setOtherUser] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };
    getUserMedia();
  }, []);

  useEffect(() => {
    if (stream) {
      const peer = new SimplePeer({ initiator: true, stream });

      peer.on('signal', (data:SimplePeer.SignalData) => {
        pusher.channel('video-call').trigger('client-signal', { signalData: data });
      });

      const channel = pusher.subscribe('video-call');

      channel.bind('signal', ({ signalData }:any) => {
        console.log(signalData)
        peer.signal(signalData);
      });

      peer.on('stream', (stream) => {
        setOtherUser(stream);
      });
    }
  }, [stream]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = otherUser;
    }
  }, [otherUser]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
}

export default VideoCall;
