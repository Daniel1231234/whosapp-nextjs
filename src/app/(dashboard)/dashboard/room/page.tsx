import VideoCall from "@/components/VideoCall";

interface PageProps {}

const Page = async ({}: PageProps) => {
  return <div className="flex justify-center items-center">
    <VideoCall />
  </div>;
};

export default Page;
