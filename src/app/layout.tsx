import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "WhosApp",
  description: "Welcome to WhosApp!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="portal" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
