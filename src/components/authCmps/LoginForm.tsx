import { UserLoginCred } from "@/types/typings";
import { Dispatch, SetStateAction } from "react";

interface LoginFormProps {
  handleCred: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  userCreds: UserLoginCred;
  setUserCreds: Dispatch<SetStateAction<UserLoginCred>>;
}
const LoginForm = ({ handleCred, userCreds, setUserCreds }: LoginFormProps) => {
  return (
    <form className="mt-6" onSubmit={(e) => handleCred(e)}>

      <div className="relative mt-3">
        <input
          className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
          id="email"
          type="text"
          placeholder="Email"
          value={userCreds.email}
          onChange={(e) =>
            setUserCreds({ ...userCreds, email: e.target.value })
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

      <div className="relative mt-3">
        <input
          className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
          id="password"
          type="text"
          placeholder="Password"
          value={userCreds.password}
          onChange={(e) =>
            setUserCreds({ ...userCreds, password: e.target.value })
          }
        />
        <div className="absolute left-0 inset-y-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 ml-3 text-gray-400 p-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        <button className="text-white py-2 px-4 uppercase rounded bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
          Sign in{" "}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
