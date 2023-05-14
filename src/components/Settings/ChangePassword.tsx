import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Button from "../UI/Button";

interface ChangePasswordProps {
  handleChangePassword:(e:any, changedPassword:string) => void
}

const ChangePassword = ({handleChangePassword}:ChangePasswordProps) => {
  const [currPassword, setCurrPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageDisplayed, setMessageDisplayed] = useState(false);

  useEffect(() => {
    const debouncedRequest = debounce(async () => {
      if (currPassword !== "") {
        try {
          const response = await axios.post("/api/user/change-pass", {
            currPassword,
          });
          if (response.status === 200) {
            setPasswordMatch(true);
          } else {
            setPasswordMatch(false);
          }
        } catch (error) {
          setPasswordMatch(false);
          setCurrPassword("");
        } finally {
          setLoading(false);
          setMessageDisplayed(true);
        }
      }
    }, 3000);

    debouncedRequest();

    return () => {
      debouncedRequest.cancel();
    };
  }, [currPassword]);

  return (
    <div className="sm:col-span-8">
      <label
        htmlFor="password"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
      >
        Change Password
      </label>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 ">
        <div className="mt-2 w-full ">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="password"
              name="password"
              id="curr-password"
              value={currPassword}
              onChange={(e) => {
                if (currPassword === "") setLoading(true);
                setCurrPassword(e.target.value);
              }}
              className="block flex-1 w-full border-0 dark:bg-slate-800 py-1.5 pl-1 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Current Password"
            />
          </div>
        </div>
        <div className="mt-2 w-full ">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="password"
              name="password"
              id="password"
              disabled={!passwordMatch}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block flex-1 w-full border-0 dark:bg-slate-800 py-1.5 pl-1 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="New Password"
            />
          </div>
        </div>
        <div className="mt-2">
          {passwordMatch && !loading && messageDisplayed && (
            <span className="text-sm text-green-400">Passwords match!</span>
          )}
          {!passwordMatch && !loading && messageDisplayed && (
            <span className="text-sm text-red-400">
              Passwords do not match!
            </span>
          )}
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        </div>
      </div>
      <Button onClick={(e) => handleChangePassword(e, newPassword)} className="text-green-400" disabled={!passwordMatch}>
        Change password
      </Button>
    </div>
  );
};

export default ChangePassword;
