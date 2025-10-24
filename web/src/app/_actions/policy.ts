"use server";
import contracts from "@/constants/contracts";
import {
  getContract,
  decodeEventLog,
  parseUnits,
  createPublicClient,
  http,
  Hex,
  formatUnits,
  createWalletClient,
} from "viem";
import { sepolia } from "viem/chains";
import { publicViemClient } from "../viem";
import { db } from "@/db";
import { policyTemplate, premium, userPolicy } from "@/db/schema/policy";
import { eq } from "drizzle-orm";
import {
  PolicyNFT1,
  PolicyNFT2,
  PolicyNFT3,
  PolicyNFT4,
  PolicyNFT5,
  PolicyNFT6,
  PolicyNFT7,
  PolicyNFT8,
} from "@/constants/policy";
import { privateKeyToAccount } from "viem/accounts";

const INFURA_RPC_URL = process.env.INFURA_RPC_URL;

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
    const mUSDCAddress = contracts.MUSDC.address;
    const PremiumTreasuryAddress = contracts.PremiumTreasury.address;
    const OracleConsumerAddress = contracts.OracleConsumer.address;

    const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);

    const walletViemClient = createWalletClient({
      transport: http(INFURA_RPC_URL),
      account: account,
    });

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
        description,
        PolicyNFT3, // mock image (ipfs://)
        OracleConsumerAddress,
        PremiumTreasuryAddress,
        mUSDCAddress,
        parseUnits(premiumAmount, 18),
        parseUnits(payoutAmount, 18),
      ],
      {
        chain: sepolia,
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
        imageUrl: PolicyCreatedEvent.args.imageUrl,
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
      .leftJoin(
        userPolicy,
        eq(userPolicy.policyTemplateSlug, policyTemplate.slug)
      )
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
      chain: sepolia,
      transport: http(process.env.INFURA_RPC_URL!),
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash as Hex,
    });

    const logs = receipt.logs.filter(
      (log) => log.address.toLowerCase() === receipt.to?.toLowerCase()
    );
    const decodedEvents = [];

    for (const log of logs) {
      const decodedEvent = decodeEventLog({
        abi: contracts.PolicyContract.abi,
        topics: log.topics,
        data: log.data,
      });

      decodedEvents.push(decodedEvent);
    }

    const PolicyPurchasedEvent = decodedEvents.find(
      (e) => e.eventName === "PolicyPurchased"
    );

    console.log({
      PolicyPurchasedEvent,
    });

    if (!PolicyPurchasedEvent) {
      throw new Error(`Policy purchased is event not found`);
    }

    const [newUserPolicy] = await db
      .insert(userPolicy)
      .values({
        policyTemplateSlug: PolicyPurchasedEvent.args.policySlug,
        ownerAddress: PolicyPurchasedEvent.args.owner.toString(),
        premiumPaid: formatUnits(PolicyPurchasedEvent.args.amount, 18),
        txHash: hash,
        tokenId: PolicyPurchasedEvent.args.tokenId.toString(),
        tokenURI: PolicyPurchasedEvent.args.tokenURI,
        inputs: {
          network: policy.network,
          assetPairAddress: policy.assetPairAddress,
        },
        status: "verified",
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

export async function payPremium({
  hash,
  userPolicyId,
}: {
  hash: string;
  userPolicyId: string;
}) {
  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.INFURA_RPC_URL!),
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash as Hex,
    });

    const logs = receipt.logs.filter(
      (log) => log.address.toLowerCase() === receipt.to?.toLowerCase()
    );
    const decodedEvents = [];

    for (const log of logs) {
      const decodedEvent = decodeEventLog({
        abi: contracts.PolicyContract.abi,
        topics: log.topics,
        data: log.data,
      });

      decodedEvents.push(decodedEvent);
    }

    const PremiumPaidEvent = decodedEvents.find(
      (e) => e.eventName === "PremiumPaid"
    );
    if (!PremiumPaidEvent) {
      throw new Error(`Premium Paid event not found`);
    }

    await db.insert(premium).values({
      ownerAddress: receipt.from,
      policyTemplateSlug: PremiumPaidEvent.args.policySlug,
      premiumPaid: formatUnits(PremiumPaidEvent.args.amount, 18),
      txHash: hash,
      userPolicyId,
    });

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error(`src.app._actions.policy.payPremium.error ${error}`);
    return {
      data: null,
      error: "Internal server error",
    };
  }
}

//createPolicy({
//  name: "Exchange Protect",
//  description: "Insurance for funds held on centralized or hybrid exchanges.",
//  coverageTerms: [],
//  payoutAmount: "10000",
//  premiumAmount: "100"
//}).then(d => {
//  console.log(d)
//  process.exit(0)
//}).catch(e => {
//  console.error(e)
//  process.exit(1)
//})
