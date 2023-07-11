"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import Button from "./UI/Button";

interface FriendRequestPreviewModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  friendRequests: IncomingFriendRequest[];
  handleFriendRequest: (senderId: string, action: string) => Promise<void>;
}

const FriendRequestPreviewModal: React.FC<FriendRequestPreviewModalProps> = ({
  open,
  setOpen,
  friendRequests,
  handleFriendRequest,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  New friend requests
                </Dialog.Title>
                {friendRequests.map((request) => (
                  <div
                    key={request.senderId}
                    className="flex w-full items-center justify-evenly p-2 border-b"
                  >
                    <div className="relative">
                      <Image
                        src={request.senderImage!}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt=""
                      />
                    </div>
                    <h2>{request.senderName}</h2>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleFriendRequest(request.senderId, "accept")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleFriendRequest(request.senderId, "deny")
                        }
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FriendRequestPreviewModal;
