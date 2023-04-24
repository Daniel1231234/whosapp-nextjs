'use client'

import { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import Button from "../UI/Button"
import { useRouter } from "next/navigation";

interface SignInVideoProps {
  userName:string | null | undefined
  userId:string
}


const SignInVideo = ({userName, userId}:SignInVideoProps) => {
  const endpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT;
  const [selectValues, setSelectValues] = useState("guest");
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState<string>(userName ? userName : "");
  const router = useRouter()

  const joinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fetchtoken = async () => {
      const response = await fetch(`${endpoint}api/token`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          role: selectValues, 
          type: "app",
          room_id: process.env.NEXT_PUBLIC_ROOM_ID,
        }),
      });
      const { token } = await response.json();
      return token;
    };

    const token = await fetchtoken();
    hmsActions.join({
      userName: inputValues,
      authToken: token,
      settings: {
        isAudioMuted: true,
      },
    });

    if (token) router.push('/conference')
  };


  return (
    <form
      onSubmit={joinRoom}
      className="max-w-[450px] my-60 mx-auto shadow-lg rounded-lg p-5"
    >
      <h2 className="meeting-title mb-5 font-bold text-center">Join Meeting</h2>
      <div className="input-container mb-5">
        <input
          className="w-full border rounded-lg h-8 p-1"
          required
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
        />
      </div>
      <div className="input-container mb-5">
        <select
          placeholder="Select Role"
          value={selectValues}
          onChange={(e) => setSelectValues(e.target.value)}
          className="w-full border rounder-lg h-8 p-1 "
        >
          <option value="guest">guest</option>
          <option value="host">host</option>
        </select>
      </div>
      <Button className="btn-signin" type="submit">
        Join
      </Button>
    </form>
  );
}

export default SignInVideo;
