"use client";

import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validation/message";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import RightClickMenu from "./RightClickMenu";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  isWiderScreen: false,
};

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [msg, setMsg] = useState({ id: "", text: "" });
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const demoImg = `https://robohash.org/${sessionId}`
  

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    const deleteMsgHandler = (message: Message) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    };

    pusherClient.bind("message-removed", deleteMsgHandler);
    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
      pusherClient.unbind("message-removed", deleteMsgHandler);
    };
  }, [chatId]);

  const openMenu = (
    e: React.MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
    message: Message
  ) => {
    e.preventDefault();
    const { pageX, pageY } = e;
    const windowSize = window.innerWidth;

    setMsg(message);

    if (pageX + 220 > windowSize) {
      setContextMenu({ show: true, x: pageX, y: pageY, isWiderScreen: true });
    } else {
      setContextMenu({ show: true, x: pageX, y: pageY, isWiderScreen: false });
    }
  };

  const removeMsg = async () => {
    try {
       await axios.post("/api/message/remove", {
        message: msg,
        chatId,
      });
      toast.success("Message removed successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
        return;
      }
    }
  };

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      toast.success("Text copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy text");
    }
  };

  const closeContextMenu = () => setContextMenu(initialContextMenu);

  return (
    <div
      id="messages"
      className="flex dark:bg-bg-chat h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {contextMenu.show && (
        <RightClickMenu
          copyTextToClipboard={copyTextToClipboard}
          handleRemoveMsg={removeMsg}
          isWiderScreen={contextMenu.isWiderScreen}
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={closeContextMenu}
        />
      )}

      {messages.map((msg, idx) => {
        const isVoiceMsg = msg.text.startsWith("blob");
        const isCurrUser = msg.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[idx - 1]?.senderId === messages[idx].senderId;

        const formatTimeStamp = (timestamp: number) => {
          return format(timestamp, "HH:mm");
        };

        return (
          <div key={`${msg.id}-${msg.createdAt}`} className="chat-message">
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrUser,
                    "order-2 items-start": !isCurrUser,
                  }
                )}
              >
                {isVoiceMsg ? (
                  <audio src={msg.text} controls  onContextMenu={(e) => openMenu(e, msg)}></audio>
                ) : (
                  <span
                    onContextMenu={(e) => openMenu(e, msg)}
                    className={cn("px-4 py-2 rounded-lg inline-block", {
                      "bg-indigo-600 text-white dark:bg-[#202C33]": isCurrUser,
                      "bg-gray-200 text-gray-900 dark:bg-[#005C4B] dark:text-white ": !isCurrUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrUser,
                    })}
                  >
                    {msg.text}{" "}
                    <span className="ml-2 text-sm text-gray-400">
                      {formatTimeStamp(msg.createdAt)}
                    </span>
                  </span>
                )}
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrUser,
                  "order-1": !isCurrUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={isCurrUser ? (sessionImg as string ? sessionImg as string : demoImg) : (chatPartner.image ? chatPartner.image : demoImg)}
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
