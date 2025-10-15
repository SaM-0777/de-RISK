"use client";
import Navbar from "@/components/common/navbar";
import { useGetPolicies } from "@/hooks/use-policy";
import PolicyCard from "@/components/common/policy-card";

export default function Home() {
  const { policies, isLoadingPolicies, errorPolicies } = useGetPolicies();

  if (isLoadingPolicies) {
    return (
      <main>
        <Navbar />
        <div>Loading...</div>
      </main>
    );
  }

  if (errorPolicies) {
    return (
      <main>
        <Navbar />
        <div>Error: {errorPolicies}</div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="grid grid-cols-4 gap-4">
        {policies?.map((p) => (
          <PolicyCard key={p.policyId} policy={p} />
        ))}
      </div>
    </main>
  );
}
