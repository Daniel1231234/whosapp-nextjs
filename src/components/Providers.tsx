"use client";

import { ThemeProvider } from "next-themes";
import { FC } from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" enableSystem={false}>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </ThemeProvider>
    </>
  );
};

export default Providers;
