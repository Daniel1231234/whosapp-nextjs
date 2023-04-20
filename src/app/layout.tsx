import Providers from "../components/Providers";
import "./globals.css";

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
    <html lang="en">
      <body>
      <div id="portal" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
