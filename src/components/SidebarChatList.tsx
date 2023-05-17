"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefContructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import { Trash2Icon } from "lucide-react";
import axios from "axios";


interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList = ({ friends, sessionId }: SidebarChatListProps) => {
  const path = usePathname();
  const router = useRouter()
  const [unseenMsgs, setUnseenMsgs] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const handleDeleteChat = async (
    e: React.MouseEvent<HTMLElement>,
    friendId: string
  ) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/api/friends/remove/${friendId}`)
      console.log(res)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    }

    const removeFriendHandler = (friendToRemoveId:string) => {
      setActiveChats((prev) => prev.filter((friend) => friend.id !== friendToRemoveId))
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shoudNotify =
        path !==
        `/dashboard/chat/${chatHrefContructor(sessionId, message.senderId)}`;
      if (!shoudNotify) return;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));

      setUnseenMsgs((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);
    pusherClient.bind('remove_friend', removeFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler)
      pusherClient.bind('remove_friend', removeFriendHandler)
    };
  }, [path, sessionId]);

  useEffect(() => {
    if (path?.includes("chat")) {
      setUnseenMsgs((prev) => {
        return prev.filter((msg) => !path.includes(msg.senderId));
      });
    }
  }, [path]);

  return (
    <ul
      role="list"
      className="max-h-[25rem] dark:hover:text-gray-800 dark:text-gray-50 overflow-y-auto -mx-2 space-y-1"
    >
      {activeChats.sort().map((friend) => {
        const unseenMsgsCount = unseenMsgs.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li
            key={friend.id}
            onMouseEnter={() => setHoveredIndex(friend.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a
              className="text-gray-700 dark:hover:text-gray-800 dark:text-gray-100 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              href={`/dashboard/chat/${chatHrefContructor(
                sessionId,
                friend.id
              )}`}
            >
              {friend.name}
              {unseenMsgs.length > 0 && (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMsgsCount}
                </div>
              )}
              {hoveredIndex === friend.id && (
                <button
                  className="ml-auto text-gray-500 hover:text-red-500"
                  onClick={(e) => handleDeleteChat(e, friend.id)}
                >
                  <Trash2Icon />
                </button>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
