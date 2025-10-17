"use server";
import contracts from "@/contracts";
import { getContract, decodeEventLog, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { publicViemClient, walletViemClient } from "../viem";
import { db } from "@/db";
import { policyTemplate } from "@/db/schema/policy";

export async function createPolicy({
  name,
  description,
  payoutAmount,
  coverageTerms,
  premiumAmount,
}: {
  name: string;
  description: string;
  premiumAmount: string;
  payoutAmount: string;
  coverageTerms: string[];
}) {
  try {
    const mUSDCAddress = process.env.MUSDC as `0x${string}`;
    const PremiumTreasuryAddress = process.env
      .PREMIUM_TREASURY_ADDRESS as `0x${string}`;
    const OracleConsumerAddress = process.env
      .ORACLE_CONSUMER_ADDRESS as `0x${string}`;

    const InsuranceFactoryContract = getContract({
      address: contracts.InsuranceFactory.address,
      abi: contracts.InsuranceFactory.abi,
      client: walletViemClient,
    });

    const slug = name.toLowerCase().replaceAll(" ", "_").trim();

    const tx = await InsuranceFactoryContract.write.createPolicy(
      [
        name,
        slug,
        OracleConsumerAddress,
        PremiumTreasuryAddress,
        mUSDCAddress,
        parseUnits(premiumAmount, 18),
        parseUnits(payoutAmount, 18),
      ],
      {
        chain: baseSepolia,
      }
    );

    const receipt = await publicViemClient.waitForTransactionReceipt({
      hash: tx,
    });
    const logs = receipt.logs;
    const decodedEvents = [];

    for (const log of logs) {
      const decodedEvent = decodeEventLog({
        abi: contracts.InsuranceFactory.abi,
        topics: log.topics,
        data: log.data,
      });

      decodedEvents.push(decodedEvent);
    }

    const PolicyCreatedEvent = decodedEvents.find(e => e.eventName === "PolicyCreated");
    if (!PolicyCreatedEvent) {
      throw new Error(`Policy creation is pending`)
    }

    // store it in db
    const [newPolicyTemplate] = await db
      .insert(policyTemplate)
      .values({
        contractAddress: PolicyCreatedEvent.args.policyContract,
        formSchema: {},
        name,
        description,
        oracleAddress: OracleConsumerAddress,
        payoutAmount,
        policyId: PolicyCreatedEvent.args.policyId.toString(),
        premiumAmount,
        slug,
        txHash: tx,
        coverageTerms,
      })
      .returning();

    return {
      data: {
        tx,
        policyTemplate: newPolicyTemplate,
      },
    };
  } catch (error) {
    console.error(`src.app.actions.policy.createPolicy.error ${error}`);
    return {
      error: "Internal server error",
    };
  }
}
