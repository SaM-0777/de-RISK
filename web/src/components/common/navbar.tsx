"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Navbar() {
  const { ready, login, logout, authenticated, user } = usePrivy();

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 border-b border-[#3E3E3E]">
      <div>
        <Link href={"/"}>
          <h1 className="text-2xl">
            <span className="font-semibold">De</span>
            <span>RISK</span>
          </h1>
        </Link>
      </div>

      <ul className="flex items-center justify-center gap-x-4">
        <li>
          <a href="/dashboard" className="hover:underline">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/policies" className="hover:underline">
            Policies
          </a>
        </li>
      </ul>

      <div>
        <Button
          disabled={!ready}
          variant={"outline"}
          onClick={authenticated ? logout : login}
          className="max-w-32 p-2 border-[#B09EFC] rounded-full"
        >
          <span className="w-full truncate">
            {authenticated ? user?.wallet?.address : "Connect Wallet"}
          </span>
        </Button>
      </div>
    </nav>
  );
}
