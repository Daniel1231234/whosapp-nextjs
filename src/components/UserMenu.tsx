"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { LogOut, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { cn, toPusherKey } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { Icons } from "./Icons";
import FriendRequestPreviewModal from "./FriendRequestPreviewModal";
import axios from "axios";
import Loader from "./UI/Loader";

import Darkmode from "./Darkmode";

interface UserMenuProps {
  friendRequests: IncomingFriendRequest[];
  user: any;
}

const UserMenu: React.FC<UserMenuProps> = ({ friendRequests, user }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeFriendRequests, setActiveFriendRequest] =
    useState<IncomingFriendRequest[]>(friendRequests);
  const router = useRouter();
  const UserGroup = Icons["UserGroup"];
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${user.id}:incoming_friend_requests`)
    );

    const friendRequestsHandler = (senderData: IncomingFriendRequest) => {
      setActiveFriendRequest((prev) => [...prev, senderData]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestsHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${user.id}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestsHandler);
    };
  }, [user.id, friendRequests]);

  const handleSignout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("There was a problem signing out");
    }
  };

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (activeFriendRequests.length === 0) {
      toast.error("You dont have new friend requests");
      return;
    }
    setOpen(true);
  };

  const handleFriendRequest = async (senderId: string, action: string) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/friends/${action}`, { id: senderId });
      setActiveFriendRequest((prev) =>
        prev.filter((friendReq) => friendReq.senderId !== senderId)
      );
      toast.success(`You have successfully ${action}ed the friend request`);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  if (isLoading) return <Loader isLoading={isLoading} />;
  return (
    <>
      <div className="absolute top-4 right-4">
        <Menu as="div" className="relative inline-block text-left">
          <div className="relative">
            <Menu.Button>
              {activeFriendRequests.length > 0 && (
                <div className="rounded-full w-5 h-5 text-sm flex justify-center items-center text-white bg-indigo-600 absolute top-0 left-0 ml-[-10px]">
                  {activeFriendRequests.length}
                </div>
              )}

              <Image
                src={user.image!}
                alt={user.name}
                width={35}
                height={35}
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
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-[10px]">
                          Signed in as {user.email}
                        </span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleOpenModal}
                      className={cn(
                        `group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                        {
                          "bg-violet-500 text-white": active,
                          "text-gray-900": !active,
                          "font-bold ": activeFriendRequests.length > 0,
                        }
                      )}
                    >
                      {active ? (
                        <UserGroup
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <UserGroup
                          className="mr-2 h-5 w-5 text-violet-500"
                          aria-hidden="true"
                        />
                      )}
                      Friend requests
                    </button>
                  )}
                </Menu.Item>
              </div>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={cn(
                      "group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm",
                      {
                        "bg-violet-500 text-white": active,
                        "text-gray-900": !active,
                      }
                    )}
                  >
                    <Darkmode />
                  </div>
                )}
              </Menu.Item>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignout}
                      className={cn(
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                        {
                          "bg-red-600 text-white": active,
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
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {open && (
        <FriendRequestPreviewModal
          open={open}
          setOpen={setOpen}
          friendRequests={activeFriendRequests}
          handleFriendRequest={handleFriendRequest}
        />
      )}
    </>
  );
};

export default UserMenu;
