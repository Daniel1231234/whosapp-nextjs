import AuthPage from "@/components/authCmps/AuthPage";

const Page = () => {
  return (
    <section className="flex min-h-screen items-stretch bg-slate-900">
      <div className="lg:flex w-1/2 hidden bg-slate-800 bg-no-repeat bg-cover relative items-center bg-bg-auth">
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h2 className="text-5xl font-bold text-center tracking-wide text-gray-50 hover:opacity-80 transition">
            Welcome to WhosApp!
          </h2>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0">
        <AuthPage />
      </div>
    </section>
  );
};

export default Page;
