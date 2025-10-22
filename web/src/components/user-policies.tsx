"use client";
import { useGetUserPolicies } from "@/hooks/use-policy";
import React from "react";
//import { Card, CardFooter } from "./ui/card";
import Image from "next/image";
import { parseNFTImage, parseTokenURI } from "@/utils/nft";
//import Link from "next/link";

export default function UserPolicies() {
  const { userPolicies } = useGetUserPolicies();

  if (!userPolicies) {
    return <div />;
  }

  return (
    <div className="w-full p-8 rounded-2xl border border-[#B09EFC] mt-8">
      <h2 className="text-4xl font-semibold text-center">Active Insurace</h2>

      <div className="mt-4">
        {userPolicies.data.userPolicies.map((p) => (
          <div key={p.user_policy.id} className="grid grid-cols-5 items-center gap-6 border-b border-[#636363]">
            <div>
              <Image
                src={parseNFTImage(parseTokenURI(p.user_policy.tokenURI).image)}
                width={200}
                height={200}
                alt="nft"
                priority
                className="w-40"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Plan Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {p.policy_template.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Cover Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {p.policy_template.payoutAmount}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Premium Paid</p>
              <p className="text-lg font-semibold text-gray-900">
                {p.user_policy.premiumPaid}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {p.user_policy.status.toUpperCase()}
              </p>
            </div>
          </div>
          //<Card
          //  key={p.user_policy.id}
          //  className="border-1 shadow-none flex flex-col items-center justify-center p-6"
          //>
          //<Image
          //  src={parseNFTImage(parseTokenURI(p.user_policy.tokenURI).image)}
          //  width={200}
          //  height={200}
          //  alt="nft"
          //  priority
          ///>

          //  <CardFooter className="flex flex-col items-center justify-center" >
          //    <h3 className="text-2xl font-medium text-center">
          //      {p.policy_template.name}
          //    </h3>
          //    <p className="text-center text-sm">{p.policy_template.description}</p>

          //    <Link
          //      href={`/policy/${p.policy_template.slug}`}
          //      className="flex items-center justify-between px-4 mt-6 py-2 border border-black/50 rounded-md bg-[#F7F5FF]"
          //    >
          //      <p className="text-sm" >Know More</p>
          //    </Link>
          //  </CardFooter>
          //</Card>
        ))}
      </div>
    </div>
  );
}
