import type { Metadata } from "next";
import { delight } from "./fonts";
import { Toaster } from "sonner";
import PrivyAuthProvider from "@/providers/privy-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "deRisk",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${delight.variable} antialiased font-delight bg-white`}
      >
        <PrivyAuthProvider>
          {children}
        </PrivyAuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
