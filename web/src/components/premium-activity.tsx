"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { usePremium } from "@/hooks/use-policy";

export default function PremiumActivity({
  policySlug,
}: {
  policySlug: string;
}) {
  const { premiums, isLoadingPremiums, errorPremiums } = usePremium(policySlug);

  if (isLoadingPremiums || errorPremiums || !premiums?.data) {
    return <div />;
  }

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Owner</TableHead>
            <TableHead>Premium Amount</TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Paid At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {premiums.data.userPolicies.map((up) => (
            <TableRow key={up.id}>
              <TableCell className="font-medium">
                {up.ownerAddress.toLowerCase()}
              </TableCell>
              <TableCell>{up.premiumPaid}</TableCell>
              <TableCell>{up.txHash}</TableCell>
              <TableCell className="text-right">
                {up.status.toUpperCase()}
              </TableCell>
              <TableCell className="text-right">
                {up.createdAt.split("T")[0]}
              </TableCell>
            </TableRow>
          ))}
          {premiums.data.premiums.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                {p.ownerAddress.toLowerCase()}
              </TableCell>
              <TableCell>{p.premiumPaid}</TableCell>
              <TableCell>{p.txHash}</TableCell>
              <TableCell className="text-right">
                {"Paid".toUpperCase()}
              </TableCell>
              <TableCell className="text-right">
                {p.createdAt.split("T")[0]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
