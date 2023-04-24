"use client";

import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./UI/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTyping } from "@/hooks/useIsTyping";
import CustomEmojiPicker from "./EmojiPicker";
import EmojiPicker from "emoji-picker-react";
import { File, FileIcon, SendIcon, SmileIcon } from "lucide-react";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const { handleStartTyping, handleStopTyping } = useTyping();

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (err) {
      toast.error("Something went wrong, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = () => {
    console.log("key press");
    handleStartTyping(chatPartner.name);
  };

  return (
    <div className="border-t border-gray-200 px-4 w-full">
      <label className="relative block">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 gap-1">
          <button
            onClick={(e: any) => {
              e.preventDefault();
            }}
          >
            <SendIcon className="h-5 w-5 fill-slate-300" />
          </button>
        </div>

        <TextareaAutosize
          onKeyPress={handleKeyPress}
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner?.name}`}
          className="placeholder:italic placeholder:text-slate-400 block  bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          <div className="mx-2 px-0 py-4">
            <button className="hover:bg-black hover:text-white">
              <SmileIcon className="h-5 w-5 " />
            </button>
          </div>
          
          <div className=" px-0 py-4">
            <button className="hover:bg-black hover:text-white">
              <File className="h-5 w-5 " />
            </button>
          </div>
        </div>

      </label>
    </div>
  );
};

export default ChatInput;
