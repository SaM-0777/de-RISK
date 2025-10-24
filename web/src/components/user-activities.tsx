"use client";
import React, { useMemo } from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useGetUserPolicies } from "@/hooks/use-policy";

export default function UserActivities() {
  const { userPolicies } = useGetUserPolicies();

  const sortedActivity = useMemo(() => {
    const policies = userPolicies?.data.userPolicies;
    const premiums = userPolicies?.data.premiums;

    const items: {
      owner: string;
      status: string;
      premiumPaid: string;
      txHash: string;
      createdAt: string;
    }[] = [];

    if (policies && policies.length > 0) {
      policies.forEach((policy) => {
        items.push({
          owner: policy.user_policy.ownerAddress,
          premiumPaid: policy.user_policy.premiumPaid,
          createdAt: policy.user_policy.createdAt,
          txHash: policy.user_policy.txHash,
          status: policy.user_policy.status,
        });
      });
    }

    if (premiums && premiums.length > 0) {
      premiums.forEach((premium) => {
        items.push({
          owner: premium.ownerAddress,
          status: "PAID",
          txHash: premium.txHash,
          premiumPaid: premium.premiumPaid,
          createdAt: premium.createdAt,
        });
      });
    }

    return items.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [userPolicies?.data.premiums, userPolicies?.data.userPolicies]);

  return (
    <Card className="w-full border border-[#B09EFC] bg-[#F8F6FF] rounded-2xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Your Activity
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-700 font-semibold">
                Owner
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Tx Hash
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedActivity?.map((a, i) => (
              <TableRow
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <TableCell className="text-gray-900 font-medium">
                  {a.owner.toLowerCase()}
                </TableCell>
                <TableCell className="text-gray-600">{a.premiumPaid}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{a.txHash}</TableCell>
                <TableCell className="text-gray-600">
                  {a.createdAt.split("T")[0]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
