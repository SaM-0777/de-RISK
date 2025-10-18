"use server";
import contracts from "@/contracts";
import {
  getContract,
  decodeEventLog,
  parseUnits,
  createPublicClient,
  http,
  Hex,
} from "viem";
import { baseSepolia } from "viem/chains";
import { publicViemClient, walletViemClient } from "../viem";
import { db } from "@/db";
import { policyTemplate, userPolicy } from "@/db/schema/policy";
import { eq } from "drizzle-orm";

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

    const PolicyCreatedEvent = decodedEvents.find(
      (e) => e.eventName === "PolicyCreated"
    );
    if (!PolicyCreatedEvent) {
      throw new Error(`Policy creation is pending`);
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

export async function getPolicies() {
  try {
    const policies = await db.select().from(policyTemplate);

    return {
      data: policies,
    };
  } catch (error) {
    console.error(`web.src.app.actions.policy.getPolicies.error ${error}`);
    return {
      error: "Internal server error",
    };
  }
}

export async function getPolicyBySlug(slug: string) {
  try {
    const [policy] = await db
      .select()
      .from(policyTemplate)
      .where(eq(policyTemplate.slug, slug))
      .limit(1);

    return {
      data: policy ?? null,
    };
  } catch (error) {
    console.error(`web.src.app.actions.policy.getPolicyBySlug.error ${error}`);
    return {
      error: "Internal server error",
    };
  }
}

export async function buyDepegPolicy({
  owner,
  hash,
  policy,
}: {
  hash: string;
  owner: string;
  policy: {
    policySlug: string;
    network: string;
    assetPairAddress: string;
  };
}) {
  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_SEPOLIA_RPC_URL!),
    });

    const receipt = await publicClient.getTransaction({ hash: hash as Hex });
    const value = receipt.value.toString();

    console.log({ value });

    const [newUserPolicy] = await db
      .insert(userPolicy)
      .values({
        policyTemplateSlug: policy.policySlug,
        ownerAddress: owner,
        premiumPaid: value,
        txHash: hash,
        inputs: {
          network: policy.network,
          assetPairAddress: policy.assetPairAddress,
        },
      })
      .returning();

    return {
      data: newUserPolicy,
    };
  } catch (error) {
    console.error(`web.src.app.actions.policy.buyDepegPolicy.error ${error}`);
    return {
      error: "Internal server error",
    };
  }
}
