"use client";

import { ThemeProvider } from "next-themes";
import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-wrap-balancer";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class">
        <Provider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </Provider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
