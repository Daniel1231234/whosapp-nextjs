import ProfileSection from "@/components/Settings/ProfileSection";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {}

const Page = async ({}: PageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // console.log('session => ', session)

  return (
    <div className="h-full mx-auto overflow-auto">
      <ProfileSection user={session.user as User} />
    </div>
  );
};

export default Page;
