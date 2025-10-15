"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";

export default function Navbar() {
  const { ready, login, logout, authenticated, user } = usePrivy();

  return (
    <nav className="w-full flex items-center justify-between p-4">
      <div>
        <h1>De-RISK</h1>
      </div>

      <div>
        <Button
          disabled={!ready}
          onClick={authenticated ? logout : login}
          className="max-w-28 p-2"
        >
          <span className="w-full truncate">
            {authenticated ? user?.wallet?.address : "Connect Wallet"}
          </span>
        </Button>
      </div>
    </nav>
  );
}
