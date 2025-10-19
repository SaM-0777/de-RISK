import { publicViemClient } from "@/app/viem";
import contracts from "@/constants/contracts";

export async function getPolicies() {
  try {
    const response = await publicViemClient.readContract({
      address: contracts.InsuranceFactory.address,
      abi: contracts.InsuranceFactory.abi,
      functionName: "getAllPolicies",
    });

    const jsonResponse = JSON.stringify(response, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    return JSON.parse(jsonResponse)
  } catch (error) {
    console.error(`lib.onchain.policies.getPolicies.error ${error}`);
    throw error
  }
}
