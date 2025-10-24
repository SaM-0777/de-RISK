import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

export default function PolicyCard({ policy }: { policy: PolicyTemplate }) {
  return (
    <Card key={policy.policyId}>
      <CardHeader>
        <CardTitle>{policy.name}</CardTitle>
        <p>{policy.description}</p>
      </CardHeader>
      <div>
        <p>Policy Contract: {policy.contractAddress}</p>
        <p>Oracle: {policy.oracleAddress}</p>
        <p>Premium Amount: {policy.premiumAmount.toString()}</p>
        <p>Payout Amount: {policy.payoutAmount.toString()}</p>
      </div>

      <CardFooter>
        <Link href={`/policy/${policy.slug}`} className="" >
          Buy Policy
        </Link>
        {/*<Button disabled={pending} onClick={buyPolicy}>
          Buy Policy
        </Button>*/}
      </CardFooter>
    </Card>
  );
}
