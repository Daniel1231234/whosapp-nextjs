"use client";
import { getInitialFormValues } from "@/helpers/user-settings";
import ImageUploader from "./ImageUpload";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ChangePassword from "./ChangePassword";

interface IProfilePageProps {
  user: User;
}

const ProfileSection = ({ user }: IProfilePageProps) => {
  const initialFormValues = getInitialFormValues(user);
  const [formData, setFormData] = useState<User>(initialFormValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData)
    try {
      await axios.post("/api/user/edit", formData);
      toast.success("Success");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      notification: {
        ...prevData.notification,
        [name]: checked,
      },
    }));
  }

  const handleChangePassword = (e:React.MouseEvent<HTMLButtonElement>, newPassword:string) => {
    e.preventDefault()
    try {
      if (newPassword.length < 5 || newPassword === "") {
        toast.error("Password must contain at least 5 digits")
        return
      }
      setFormData((prevData) => ({...prevData, password:newPassword}))
      toast.success("Your new Password have been saved successfully!")
    } catch (err) {
      toast.error('Something went wrong! please try again')
    }
  }

  return (
    <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-50">
        Profile
      </h1>
      <div className="space-y-12 mr-4">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-8">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        username: e.target.value,
                      }))
                    }
                    autoComplete="username"
                    className="block flex-1 w-full border-0 dark:bg-slate-800 py-1.5 pl-1 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Username"
                  />
                </div>
              </div>
            </div>
            {!user.provider && (
              <>
                <ChangePassword handleChangePassword={handleChangePassword} />
                <ImageUploader />
              </>
            )}
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">
            Personal Information
          </h2>

          <div className="mt-10 flex flex-col gap-8">
            <div className="">
              <label
                htmlFor="full-name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
              >
                Full name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  placeholder={user.name}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      name: e.target.value,
                    }))
                  }
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 dark:bg-slate-800  shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                />
              </div>
            </div>

            <div className="">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50 "
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={user.email}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      email: e.target.value,
                    }))
                  }
                  autoComplete="email"
                  className="block w-full rounded-md dark:bg-slate-800 border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      country: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset dark:bg-slate-800 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="israel">Israel</option>
                  <option value="united states">United States</option>
                  <option value="canada">Canada</option>
                  <option value="mexico">Mexico</option>
                </select>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  placeholder={user?.street}
                  value={formData.street}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      street: e.target.value,
                    }))
                  }
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12 ml-2">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">
            Notifications
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We'll always let you know about important changes, but you pick what
            else you want to hear about.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                By Email
              </legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="messages"
                      name="message"
                      type="checkbox"
                      checked={formData.notification?.message}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="messages"
                      className="font-medium text-gray-900 dark:text-gray-50"
                    >
                      Messages
                    </label>
                    <p className="text-gray-500">
                      Get notified when someone sends you a private message.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="friend-request"
                      name="friendReq"
                      type="checkbox"
                      checked={formData.notification?.friendReq}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="friend-request"
                      className="font-medium text-gray-900 dark:text-gray-50"
                    >
                      Friend Request
                    </label>
                    <p className="text-gray-500">
                      Get notified when someone sends you a friend request.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFormData(initialFormValues);
          }}
          className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfileSection;
