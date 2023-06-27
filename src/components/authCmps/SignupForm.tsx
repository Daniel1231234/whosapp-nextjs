import { UserCred } from "@/types/typings";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import CheckPassword from "./CheckPassword";
import AppLogo from "../AppLogo";
import { signIn } from "next-auth/react";

interface SignupFormProps {
  setIsSign: Dispatch<SetStateAction<boolean>>;
  setIsLoading: any;
  isLoading: boolean;
}

const SignupForm = ({
  setIsSign,
  isLoading,
  setIsLoading,
}: SignupFormProps) => {
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [userCred, setUserCreds] = useState<UserCred>({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
  });

  const handleCred = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (userCred.name === "" || userCred.email === "" || !isPasswordValid) {
        toast.error("Something went wrong with your credentails :(");
        return;
      }
      const { data } = await axios.post("/api/signup", {
        name: userCred.name,
        email: userCred.email,
        password: userCred.password,
      });
      if (data === "OK") {
        await signIn("credentials", {
          email: userCred.email,
          password: userCred.password,
          callbackUrl: `${window.location.origin}/dashboard`,
          redirect: true,
        });
      }
      toast.success("Welcome to WhosApp!");
      setIsSign(true);
    } catch (err) {
      toast.error("Something went wrong with your login.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordValid = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  return (
    <div className="w-full py-6 z-20">
      <h1 className="my-6">
        <span className="inline-flex">
          <AppLogo className="text-white" />
        </span>
      </h1>
      <p className="text-gray-100 py-4">
        Sign up to out service and start chatting
      </p>
      <form
        className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
        onSubmit={handleCred}
      >
        <div className="relative">
          <input
            className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Full Name"
            value={userCred.name}
            onChange={(e) =>
              setUserCreds({ ...userCred, name: e.target.value })
            }
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 ml-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <div className="relative mt-3">
          <input
            className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
            value={userCred.email}
            onChange={(e) =>
              setUserCreds({ ...userCred, email: e.target.value })
            }
          />
          <div className="absolute left-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 ml-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>

        <CheckPassword
          userCred={userCred}
          setUserCred={setUserCreds}
          checkPasswordValid={checkPasswordValid}
        />

        <div className="text-right text-gray-400 hover:underline hover:text-gray-100 cursor-pointer">
          <p onClick={() => setIsSign(true)}>Already have an account?</p>
        </div>

        <div className="px-4 pb-2 pt-4">
          <button className="uppercase text-white block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
            CREATE ACCOUNT{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
