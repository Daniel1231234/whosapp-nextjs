"use client";

import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./UI/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import CustomEmojiPicker from "./EmojiPicker";
import { ImageIcon, SmileIcon } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useDropzone } from "react-dropzone";
import { CldUploadButton } from "next-cloudinary";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const chatInputRef = useRef<HTMLDivElement | null>(null);

  const clonseImgContianer = () => setOpenEmojiPicker(false);

  useOnClickOutside(chatInputRef, clonseImgContianer);

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post("/api/message/send", { text: input, chatId, isImage:false });
      setInput("");
      textareaRef.current?.focus();
    } catch (err) {
      toast.error("Something went wrong, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput((prev: string) => (prev += emoji));
    clonseImgContianer();
  };

  const handleUpload = async (results: any) => {
    setIsLoading(true);
    const imageUrl = results.info.secure_url;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post("/api/message/send", { text: imageUrl, chatId, isImage:true });
      textareaRef.current?.focus();
    } catch (err) {
      toast.error(
        "Something went wrong with your image, Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="border-t dark:border-transparent border-gray-200 px-4 pt-4 mb-2 sm:mb-0"
      ref={chatInputRef}
    >
      {openEmojiPicker ? (
        <CustomEmojiPicker handleEmojiClick={handleEmojiClick} />
      ) : (
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${chatPartner?.name}`}
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
              <Button
                size="sm"
                isLoading={isLoading}
                onClick={sendMessage}
                type="submit"
              >
                Post
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                className="w-full cursor-pointer"
              >
                <SmileIcon strokeWidth={2} color="gray" />
              </Button>
              <div className="relative">
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="wz721uu6"
                >
                  <ImageIcon
                    strokeWidth={2}
                    color="gray"
                    className="cursor-pointer"
                  />
                </CldUploadButton>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {openEmojiPicker && (
        <CustomEmojiPicker handleEmojiClick={handleEmojiClick} />
      )} */}
    </div>
  );
};

export default ChatInput;
