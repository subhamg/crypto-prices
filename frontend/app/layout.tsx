import type { Metadata } from "next";
import Providers from "./providers";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Crypto Prices",
  description: "TON/USDT price viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
