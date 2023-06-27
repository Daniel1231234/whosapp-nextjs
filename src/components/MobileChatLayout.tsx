"use client";

import { Transition, Dialog } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import { Icons } from "./Icons";
import SignOutButton from "./SignOutButton";
import Button from "./UI/Button";
import SidebarChatList from "./SidebarChatList";
import { Session } from "next-auth";
import { SidebarOpt } from "@/types/typings";
import { usePathname, useRouter } from "next/navigation";
import FriendRequestSidebarOpt from "./FriendRequestSidebarOpt";
import ButtonToggleDarkMode from "./ToggleDarkMode";
import AppLogo from "./AppLogo";

interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  SidebarOpts: SidebarOpt[];
  unseenRequestCount: number;
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  SidebarOpts,
  unseenRequestCount,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed dark:bg-slate-900 bg-zinc-50 border-b dark:border-transparent border-zinc-200 top-0 inset-x-0 py-0 px-0">
      <div className="w-full flex justify-between items-center  p-2 bg-zinc-200 dark:bg-slate-700">
        <Link href="/dashboard" className="">
          <AppLogo />
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4">
          Menu <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0 " />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none  fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md ">
                    <div className="flex h-full dark:bg-slate-800 flex-col overflow-hidden bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title
                            className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300 hover:opacity-80 transition cursor-pointer"
                            onClick={() => router.push("/dashboard")}
                          >
                            Dashboard
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white dark:bg-inherit text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your chats
                          </div>
                        ) : null}

                        <nav className="flex  flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex  flex-1 flex-col gap-y-7"
                          >
                            <li>
                              <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>

                            <li>
                              <div className="text-xs dark:text-gray-400 font-semibold leading-6 text-gray-400">
                                Overview
                              </div>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {SidebarOpts.map((option) => {
                                  const Icon = Icons[option.Icon];
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className="text-gray-700  dark:text-gray-50 dark:hover:text-gray-800 hover:text-indigo-600 hover:bg-gray-50 group  flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                      >
                                        <span className="text-gray-400 border-gray-200  group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                          <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="truncate dark:hover:text-gray-800 ">
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}

                                <li>
                                  <FriendRequestSidebarOpt
                                    initialUnseenReqCount={unseenRequestCount}
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li className="-ml-6 mt-auto flex items-center">
                              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="relative h-8 w-8">
                                  <Image
                                    fill
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                    src={session.user.image || ""}
                                    alt="Your profile picture"
                                    sizes="(max-width: 768px) 100vw,
                                    (max-width: 1200px) 50vw,
                                    33vw"
                                  />
                                </div>

                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                  <span
                                    aria-hidden="true"
                                    className="dark:text-slate-300"
                                  >
                                    {session.user.name}
                                  </span>
                                  <span
                                    className="text-xs text-zinc-400 "
                                    aria-hidden="true"
                                  >
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>

                              <SignOutButton className="h-full aspect-square" />
                            </li>
                          </ul>
                        </nav>

                        <ButtonToggleDarkMode className="absolute bottom-0 left-4 md:hidden" />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
