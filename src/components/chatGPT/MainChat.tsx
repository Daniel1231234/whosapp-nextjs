"use client";

import { useEffect, useRef, useState } from "react";
import GptMessage from "./GptMessage";
import GptMessageBox from "./GptMessageBox";
import Image from "next/image";
import { GptMessageType } from "@/lib/validation/message";
import { toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";


interface MainChatProps {
  initialMessages: GptMessageType[];
  chatId: string;
}

const firstMessage = [{
  id:'abcdefg',
  role:'gpt',
  text:'Hello! how can i help you today?',
  createdAt:Date.now()
}]

const MainChat = ({ initialMessages, chatId }: MainChatProps) => {
  const [messages, setMessages] = useState<GptMessageType[]>(initialMessages ? initialMessages : firstMessage);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(initialMessages)
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (twoMessages: GptMessageType[]) => {
      console.log(twoMessages)
      setMessages((prev) => [twoMessages[1], twoMessages[0], ...prev]);
    };
    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);

  return (
    <>
      <main className="flex-1  justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)] relative">
        <div className="flex sm:items-center justify-between py-3 dark:border-transparent border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative ">
              <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  src="/avatar.png"
                  alt={`profile picture`}
                  className="rounded-full"
                  sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                />
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <div className="text-xl flex items-center">
                <span className="text-gray-700 mr-3 dark:text-gray-50 font-semibold">
                  ChatGPT
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex dark:bg-bg-chat h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          <div ref={scrollDownRef} />
          {messages.map((message) => (
            <GptMessage key={message.id} sent={message.role !== "user"}>
              {message.text}
            </GptMessage>
          ))}
        </div>

        <GptMessageBox chatId={chatId} />
      </main>
    </>
  );
};

export default MainChat;
