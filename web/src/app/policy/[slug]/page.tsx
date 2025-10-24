import { getPolicyBySlug } from "@/app/_actions/policy";
import Navbar from "@/components/common/navbar";
import React from "react";
import PolicyOverview from "@/components/policy-overview";

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: policy } = await getPolicyBySlug(slug);

  return (
    <main>
      <Navbar />
      <div className="p-8">
        {policy ? (
          <PolicyOverview
            policy={{
              policy_template: policy.policy_template,
              userPolicId: policy.user_policy?.id ?? null,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-semibold">Policy not found</h2>
          </div>
        )}

        {/*{policy ? (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">
              {policy.policy_template.name}
            </h1>
            <p className="text-lg mb-6">{policy.policy_template.description}</p>
            <div className="prose prose-lg">
              <h2>Payout Amount</h2>
              <p>{policy.policy_template.payoutAmount} USDC</p>
              <h2>Premium Amount</h2>
              <p>{policy.policy_template.premiumAmount} USDC</p>
            </div>

            <div className="space-y-6">
              <DepegPolicyForm
                policy={policy.policy_template}
                userPolicyId={policy.user_policy?.id ?? null}
              />
              <PremiumActivity policySlug={policy.policy_template.slug} />
            </div>
          </div>
        ) : (
          
        )}*/}
      </div>
    </main>
  );
}
