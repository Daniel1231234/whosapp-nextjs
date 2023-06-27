"use client";

import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { LogOut, LogOutIcon, UsersIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";

interface HeaderMenuProps {
  session: Session;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ session }) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  let friendRequests = [];

  const handleSignout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("There was a problem signing out");
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div className="relative">
          <Menu.Button>
            <div className="rounded-full w-5 h-5 text-sm flex justify-center items-center text-white bg-indigo-600 absolute top-0 left-0 ml-[-10px]">
              0
            </div>
            <Image
              src={session.user.image!}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={cn(
                      "group  w-full rounded-md px-2 py-2 text-sm",
                      {
                        "bg-violet-500 text-white": active,
                        "text-gray-900": !active,
                      }
                    )}
                  >
                    <div className="flex flex-col text-center">
                      <span>{session.user.name}</span>
                      <span className="text-[10px]">{session.user.email}</span>
                    </div>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    // onClick={handleOpenModal}
                    className={cn(
                      `group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                      {
                        "bg-violet-500 text-white": active,
                        "text-gray-900": !active,
                        "font-bold ": friendRequests.length > 0,
                      }
                    )}
                  >
                    {active ? (
                      <UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                    ) : (
                      <UsersIcon
                        className="mr-2 h-5 w-5 text-violet-500"
                        aria-hidden="true"
                      />
                    )}
                    Friend requests
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleSignout}
                    className={cn(
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                      {
                        "bg-violet-500 text-white": active,
                        "text-gray-900": !active,
                      }
                    )}
                  >
                    {active ? (
                      <LogOutIcon
                        className="mr-2 h-5 w-5 "
                        aria-hidden="true"
                      />
                    ) : (
                      <LogOut
                        className="mr-2 h-5 w-5 text-violet-500"
                        aria-hidden="true"
                      />
                    )}
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default HeaderMenu;
