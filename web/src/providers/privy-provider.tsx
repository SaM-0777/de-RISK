"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || "";

export default function PrivyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!PRIVY_APP_ID || !PRIVY_CLIENT_ID) {
    throw new Error(
      "Missing PRIVY_APP_ID or PRIVY_CLIENT_ID environment variables"
    );
  }

  

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID}
      config={{
        loginMethods: [
          "wallet"
        ],
        externalWallets: {
          walletConnect: {
            enabled: true,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
