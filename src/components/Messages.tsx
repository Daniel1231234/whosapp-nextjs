"use client";

import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validation/message";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
    };
  }, [chatId]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((msg, idx) => {
        const isCurrUser = msg.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[idx - 1]?.senderId === messages[idx].senderId;

        const formatTimeStamp = (timestamp: number) => {
          return format(timestamp, "HH:mm");
        };
        return (
          <div key={`${msg.id}-${msg.createdAt}`} className="chat-messages">
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
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrUser,
                    "bg-gray-200 text-gray-900": !isCurrUser,
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
                  src={isCurrUser ? (sessionImg as string) : chatPartner.image}
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
