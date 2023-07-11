import { Icons } from "@/components/Icons";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import SidebarChatList from "@/components/SidebarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
import { SidebarOpt } from "@/types/typings";
import AppLogo from "@/components/AppLogo";
import { db } from "@/lib/db";
import UserMenu from "@/components/UserMenu";
import { Globe } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarOpts: SidebarOpt[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
  {
    id: 3,
    name: "chat GPT",
    href: "/dashboard/chat/gpt",
    Icon: "MessageCircle",
  },
];

async function checkIfUserInDb(user: User) {
  try {
    const totalUsers: User[] = await db.smembers("users");
    const isUserInList = totalUsers.filter((usr) => usr.id === user.id);
    if (!isUserInList || isUserInList.length === 0) {
      console.log("user is not in the list");
      await db.sadd("users", JSON.stringify(user));
    }
  } catch (err) {
    console.log(err);
  }
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  await checkIfUserInDb(session.user as User);

  const friends = await getFriendsByUserId(session.user.id);

  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const senderSTR = (await fetchRedis("get", `user:${senderId}`)) as string;
      const sender = JSON.parse(senderSTR);
      return {
        senderId,
        senderEmail: sender.email,
        senderImage: sender.image,
        senderName: sender.name,
      };
    })
  );

  const unseenReqCount = incomingSenderIds.length;

  return (
    <>
      <div className="w-full flex h-screen ">
        <div className="md:hidden">
          <MobileChatLayout
            friends={friends}
            session={session}
            SidebarOpts={sidebarOpts}
            unseenRequestCount={unseenReqCount}
          />
        </div>
        <div className="hidden md:block">
          <UserMenu
            friendRequests={incomingFriendRequests}
            user={session.user}
          />
        </div>

        <div className="hidden dark:bg-slate-800  md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-none  bg-white px-6">
          <Link
            href="/dashboard"
            className="flex h-16 shrink-0  items-center border-b-2 border-gray-200 "
          >
            <div className={`flex items-center`}>
              <Globe className="mL-2" />
              <span className="text-1xl font-bold tracking-tight  rounded-md p-2">
                WhosApp
              </span>
            </div>
          </Link>

          {friends.length > 0 && (
            <div className="text-xs font-semibold leading-6 text-green-400 ">
              Your chats
            </div>
          )}

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <SidebarChatList
                  friends={friends}
                  sessionId={session.user.id}
                />
              </li>
              <li>
                <div className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-50">
                  Overview
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sidebarOpts.map((opt) => {
                    const Icon = Icons[opt.Icon];
                    return (
                      <li key={opt.id}>
                        <Link
                          href={opt.href}
                          className="text-gray-700  hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold dark:hover:text-gray-900 dark:text-gray-50"
                        >
                          <span className="text-gray-400  border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate ">{opt.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li className="-mx-6 mt-auto flex items-center">
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 ">
                  <div className="relative h-8 w-8 ">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      src={session.user.image!}
                      alt="Your profile picture"
                      sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw
                    "
                    />
                  </div>

                  <span className="sr-only">Your profile</span>
                  <div className="flex flex-col">
                    <span aria-hidden="true" className="dark:text-gray-50">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-zinc-400 " aria-hidden="true">
                      {session.user.email}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <aside className="max-h-screen container py-16 md:py-12 sm:py-4 w-full">
          {children}
        </aside>
      </div>
    </>
  );
};

export default Layout;
