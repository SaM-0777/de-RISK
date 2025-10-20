import Navbar from "@/components/common/navbar";
import PolicyCard from "@/components/common/policy-card";
import { getPolicies } from "./_actions/policy";

export default async function Home() {
  const { data: policies } = await getPolicies();

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
