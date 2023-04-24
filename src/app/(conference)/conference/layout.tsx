import Button from "@/components/UI/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Video Conference",
  description: "Video Conference - WhosApp",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  if (!session) return notFound()

  return (
    <div className="dark:bg-gray-800 container ">
      <h2>Video Conference</h2>
      <Button>
        <Link href="/dashboard">Back</Link>
      </Button>
      {children}
    </div>
  );
}
