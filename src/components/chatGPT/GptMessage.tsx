
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

type MessageProp = {
  sent?: boolean; // Sent or received
  children?: ReactNode;
};

const GptMessage = ({  sent, children }: MessageProp) => {
  return (
    <div className={cn("flex items-end", { "justify-end": sent })}>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-xs mx-2", {
          "order-1 items-end": sent,
          "order-2 items-start": !sent,
        })}
      >
        <span
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-indigo-600 text-white dark:bg-[#202C33]": sent,
            "bg-gray-200 text-gray-900 dark:bg-[#005C4B] dark:text-white ":
              !sent,
            "rounded-br-none": sent,
            "rounded-bl-none": !sent,
          })}
        >
          {children}
        </span>
      </div>
      <div
        className={cn("relative w-6 h-6", {
          "order-2": sent,
          "order-1": !sent,
        })}
      >
        <Image
          fill
          src={"/avatar.png"}
          alt="Profile picture"
          referrerPolicy="no-referrer"
          className="rounded-full"
          sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
        />
      </div>
    </div>
  );
};

export default GptMessage;
