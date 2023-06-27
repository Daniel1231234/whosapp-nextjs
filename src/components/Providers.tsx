"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-wrap-balancer";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <Provider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
