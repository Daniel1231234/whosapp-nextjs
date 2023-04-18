"use client";

import { FC, useState } from "react";
import Button from "./UI/Button";
import { addFriendSchema } from "@/lib/validation/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendSchema>;

const AddFriendButton: FC<AddFriendButtonProps> = () => {
  const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendSchema),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendSchema.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });
      setShowSuccessMsg(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError("email", { message: err.message });
        return;
      }
      if (err instanceof AxiosError) {
        setError("email", { message: err.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="clock text-sm font-medium leading-6 text-gray-800"
      >
        Add friend by E-Mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-green-900 shadow-sm ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessMsg && (
        <p className="mt-1 text-sm text-green-600">Friend request sent</p>
      )}
    </form>
  );
};

export default AddFriendButton;
