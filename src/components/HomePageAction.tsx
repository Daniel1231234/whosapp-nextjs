"use client";

import Button from "./UI/Button";
import { useRouter } from "next/navigation";
import axios from "axios";

interface HomePageActionProps {
  userId: string
}

const HomePageAction = ({ userId }: HomePageActionProps) => {
  const router = useRouter();

  const handleUserData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await axios.post("/api/user", {userId});
      router.push("/dashboard1");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Button onClick={handleUserData}>Dashboard</Button>
    </div>
  );
};

export default HomePageAction;
