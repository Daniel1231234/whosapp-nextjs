import { Mic } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Button from "./UI/Button";

interface Props {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const mimeType = "audio/webm";

const VoiceMessageRecorder: React.FC<Props> = ({ onRecordingComplete }) => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const getMicrophonePermission = async (): Promise<void> => {
    if ("MediaRecorder" in window) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(mediaStream);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }

  const disableAudio = (): void => {
    if (stream && stream.getTracks().length > 0) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.stop();
      setPermission(false);
      setStream(null);
    }
  };
  

  const startRecording = async (): Promise<void> => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream!, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    console.log("start");
    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") {
        console.log("event.data is undefined!");
        return;
      }

      if (event.data.size === 0) {
        console.log("event.data.size is 0!");
        return;
      }
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current!.stop();
    console.log("end");
    mediaRecorder.current!.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      onRecordingComplete(audioBlob);
      setAudioChunks([]);
    };
  };

  const handleRecordButtonPress = (
    event:
      | React.TouchEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    recordingStatus === "inactive" ? startRecording() : stopRecording();
  };

  if (!permission)
    return (
      <Button onClick={getMicrophonePermission} type="button">
        Get Microphone
      </Button>
    );

  return (
    <>
      <button
        onTouchStart={handleRecordButtonPress}
        onTouchEnd={handleRecordButtonPress}
        onMouseDown={handleRecordButtonPress}
        onMouseUp={handleRecordButtonPress}
        type="button"
        className={`bg-gray-900 flex items-center rounded-full p-3 w-12 h-12 focus:outline-none transition-all ${
          recordingStatus === "recording" ? "scale-110 bg-green-400" : ""
        } ${recordingStatus === "inactive" ? "bg-red-500 animate-pulse" : ""}`}
      >
        <Mic className="text-white h-8 w-8" />
      </button>
      <button onClick={disableAudio}>disable mic</button>
    </>
  );
};

export default VoiceMessageRecorder;
