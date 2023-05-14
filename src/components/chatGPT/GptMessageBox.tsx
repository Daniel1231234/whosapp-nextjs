"use client";

import axios from "axios";
import clsx from "clsx";
import { useRef, useState } from "react";
import Button from "../UI/Button";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";

type MessageBoxProps = {
  chatId?: string;
};

const GptMessageBox = ({ chatId,  }: MessageBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!message) return;
    setIsSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
       await axios.post("/api/message/gpt", { message, chatId });
      setMessage("");
    } catch (err) {
      toast.error("Something went wrong, Please try again later.");
      console.log(err);
    } finally {
      setIsSending(false);
    }
  };



  return (
    <div className="border-t dark:border-transparent border-gray-200 px-4 pt-4 mb-2 sm:mb-0 ">
    <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <TextareaAutosize
        ref={textareaRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Type here...`}
        className="block w-full dark:text-gray-50 resize-none border-0 bg-transparent  text-gray-900 placeholder:text-gray-400 placeholder:ml-3 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
      />

      <div
        onClick={() => textareaRef.current?.focus()}
        className="py-1 dark:border-transparent border-t-2"
        aria-hidden="true"
      >
        <div className="py-px">
          <div className="h-9" />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 flex  justify-between py-2 pl-3 pr-2">
        <div className="flex-shrink-0 flex-row-reverse flex items-center justify-center gap-2 ">
          <Button size="sm" isLoading={isSending} onClick={sendMessage} type="submit">
            Post
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default GptMessageBox;
