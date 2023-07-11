import AddFriendButton from "@/components/AddFriendForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default Page;
