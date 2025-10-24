/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import contracts from "@/constants/contracts";
import { usePolicyPurchasedByPolicySlug } from "@/hooks/use-policy";
import { parseNFTImage } from "@/utils/nft";
import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  createPublicClient,
  createWalletClient,
  custom,
  Hex,
  http,
  parseUnits,
} from "viem";
import { sepolia } from "viem/chains";
import { Button } from "./ui/button";
import { buyDepegPolicy, payPremium } from "@/app/_actions/policy";

export default function PolicyOverview({
  policy,
}: {
  policy: {
    policy_template: PolicyTemplate;
    userPolicId: string | null
  };
}) {
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();
  const [pending, setPending] = useState<boolean>(false);
  const { data, isLoading } = usePolicyPurchasedByPolicySlug(
    policy.policy_template.slug
  );

  function handleConnectWallet() {
    setPending(true);
    try {
      connectWallet({
        walletList: ["detected_ethereum_wallets"],
        walletChainType: "ethereum-only",
      });
    } catch (error) {
      console.error("connectWallet failed:", error);
      toast.error("Wallet connection cancelled or failed");
      return;
    } finally {
      setPending(false);
    }
  }

  async function handlePayPremium() {
    const userPolicyId = policy.userPolicId;

    if (!userPolicyId) {
      toast.error("User policy ID not found");
      return;
    }

    if (!ready) {
      toast.info("Auth not ready");
      return;
    }

    if (!data?.PolicyContract_PolicyPurchased.length) {
      toast.error("You need to buy this policy first");
      return;
    }

    if (!wallets || wallets.length === 0) {
      handleConnectWallet();
    } else {
      setPending(true);

      try {
        const wallet = wallets[0];
        await wallet.switchChain(sepolia.id);

        const provider = await wallet.getEthereumProvider();
        const walletClient = createWalletClient({
          account: wallet.address as `0x${string}`,
          chain: sepolia,
          transport: custom(provider),
        });
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(process.env.INFURA_RPC_URL),
        });

        // approve token
        const approveHash = await walletClient.writeContract({
          address: contracts.MUSDC.address,
          abi: contracts.MUSDC.abi,
          functionName: "approve",
          args: [
            policy.policy_template.contractAddress as Hex,
            parseUnits(policy.policy_template.premiumAmount, 18),
          ],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        const nextNonce = await publicClient.getTransactionCount({
          address: wallet.address as `0x${string}`,
        });

        const payPremiumTx = await walletClient.writeContract({
          address: policy.policy_template.contractAddress as Hex,
          abi: contracts.PolicyContract.abi,
          functionName: "payPremium",
          args: [parseUnits("0", 18)],
          nonce: nextNonce,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: payPremiumTx,
        });

        toast.success(`Premium paid successfully ${receipt.transactionHash}`);

        const { error } = await payPremium({
          hash: receipt.transactionHash,
          userPolicyId,
        });

        if (error) {
          toast.error(error);
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setPending(false);
      }
    }
  }

  async function onSubmit() {
    if (!ready) {
      toast.info("Auth not ready");
      return;
    }

    if (!wallets || wallets.length === 0) {
      try {
        connectWallet({
          walletList: ["detected_ethereum_wallets"],
        });
      } catch (error) {
        console.error("connectWallet failed:", error);
        toast.error("Wallet connection cancelled or failed");
        return;
      }
    }

    setPending(true);

    try {
      const wallet = wallets[0];
      await wallet.switchChain(sepolia.id);

      console.log({
        w: wallet.address,
      });

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as Hex,
        chain: sepolia,
        transport: custom(provider),
      });
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.INFURA_RPC_URL),
      });

      // approve token
      const approveHash = await walletClient.writeContract({
        address: contracts.MUSDC.address,
        abi: contracts.MUSDC.abi,
        functionName: "approve",
        args: [
          policy.policy_template.contractAddress as Hex,
          parseUnits(policy.policy_template.premiumAmount, 18),
        ],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      const nextNonce = await publicClient.getTransactionCount({
        address: wallet.address as `0x${string}`,
      });

      const buyPremiumTx = await walletClient.writeContract({
        address: policy.policy_template.contractAddress as Hex,
        abi: contracts.PolicyContract.abi,
        functionName: "buyPolicy",
        args: [wallet.address as Hex, parseUnits("0", 18)],
        nonce: nextNonce,
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: buyPremiumTx,
      });

      const { error } = await buyDepegPolicy({
        owner: wallet.address,
        hash: receipt.transactionHash,
        policy: {
          policySlug: policy.policy_template.slug,
          assetPairAddress: "",
          network: "Ethereum Sepolia",
        },
      });

      if (error) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.error(`buyPolicy failed:`, error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center gap-4 my-[8vh]">
        <h1 className="text-5xl text-center font-semibold text-[#B09DFB]">
          {policy.policy_template.name}
        </h1>
        <p className="text-center">{policy.policy_template.description}</p>

        <div className="mt-4">
          <Button
            type="button"
            disabled={pending || isLoading}
            onClick={
              data?.PolicyContract_PolicyPurchased.length
                ? handlePayPremium
                : onSubmit
            }
            className="text-white bg-gradient-to-br from-[#AE9AFF] to-[#5A4B99]"
          >
            {data?.PolicyContract_PolicyPurchased.length
              ? `Pay Premium $${policy.policy_template.premiumAmount}`
              : `Buy Policy $${policy.policy_template.premiumAmount}`}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl w-full flex items-center justify-between p-8 rounded-2xl border border-[#B09EFC] bg-gradient-to-tr from-white to-[#E9E4FF] mt-8">
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>

          <div className="mt-6 space-y-2">
            <div className="grid grid-cols-2 items-center gap-x-16">
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm">On-Chain</p>
            </div>
            <div className="grid grid-cols-2 items-center gap-x-16">
              <p className="text-sm font-medium">Payout Amount</p>
              <p className="text-sm">
                {policy.policy_template.payoutAmount} MUSDC
              </p>
            </div>
            <div className="grid grid-cols-2 items-center gap-x-16">
              <p className="text-sm font-medium">Premium Amount</p>
              <p className="text-sm">
                {policy.policy_template.premiumAmount} MUSDC
              </p>
            </div>
            <div className="grid grid-cols-2 items-center gap-x-16">
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm">
                {data?.PolicyContract_PolicyPurchased.length
                  ? "Insured"
                  : "Not Insured"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <Image
            src={parseNFTImage(policy.policy_template.imageUrl)}
            width={256}
            height={256}
            alt="nft"
            className="size-44"
          />
        </div>
      </div>
    </div>
  );
}
