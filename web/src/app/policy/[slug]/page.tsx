import { getPolicyBySlug } from "@/app/actions/policy";
import DepegPolicyForm from "@/components/depeg-policy-form";
import React from "react";

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: policy } = await getPolicyBySlug(slug);

  return (
    <div className="w-full h-full">
      {policy ? (
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4">{policy.name}</h1>
          <p className="text-lg mb-6">{policy.description}</p>
          <div className="prose prose-lg">
            <h2>Payout Amount</h2>
            <p>{policy.payoutAmount} USDC</p>
            <h2>Premium Amount</h2>
            <p>{policy.premiumAmount} USDC</p>
          </div>

          {policy.slug === "depeg_insurance" ? (
            <DepegPolicyForm
              policy={policy}
            />
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-2xl font-semibold">Policy not found</h2>
        </div>
      )}
    </div>
  );
}
