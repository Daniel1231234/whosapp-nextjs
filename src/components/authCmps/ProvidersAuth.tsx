import Button from "../UI/Button";
import { Icons } from "../Icons";

interface ProvidersAuthProps {
  isLoading?: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const ProvidersAuth = ({
  loginWithFacebook,
  loginWithGoogle,
}: ProvidersAuthProps) => {
  const FbIcon = Icons["Facebook"];
  const GoogleIcon = Icons["Google"];

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 my-4 w-full">
      <Button
        type="button"
        className="max-w-sm mx-auto w-3/5"
        onClick={loginWithGoogle}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>

      <Button
        type="button"
        className="max-w-sm mx-auto w-3/5"
        onClick={loginWithFacebook}
      >
        <FbIcon className="w-6 h-6 " />
        Sign in with Facebook
      </Button>
    </div>
  );
};

export default ProvidersAuth;
