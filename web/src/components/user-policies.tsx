"use client";
import { useGetUserPolicies, useUserPolicies } from "@/hooks/use-policy";
import React from "react";
import Image from "next/image";
import { parseNFTImage, parseTokenURI } from "@/utils/nft";
import { formatUnits } from "viem";
import { Skeleton } from "./ui/skeleton";

export default function UserPolicies() {
  const { userPolicies } = useGetUserPolicies();
  const { data } = useUserPolicies();

  return (
    <div className="w-full p-8 rounded-2xl border border-[#B09EFC] mt-8">
      <h2 className="text-4xl font-semibold text-center">Active Insurace</h2>

      <div className="mt-4 space-y-6">
        {!data?.PolicyContract_PolicyPurchased || !userPolicies
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-44 mb-4 rounded-lg bg-purple-300"
              />
            ))
          : data?.PolicyContract_PolicyPurchased.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-5 items-center gap-6 border-b border-[#636363] pb-4"
              >
                <div>
                  <Image
                    src={parseNFTImage(parseTokenURI(p.tokenURI).image)}
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
                    {parseTokenURI(p.tokenURI).name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Cover Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {
                      userPolicies?.data.userPolicies.find(
                        (up) => up.policy_template.slug === p.policySlug
                      )?.policy_template.payoutAmount
                    }{" "}
                    MUSDC
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatUnits(BigInt(p.amount), 18)}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
