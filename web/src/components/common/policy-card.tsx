"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { usePrivy, useWallets, useConnectWallet } from "@privy-io/react-auth";
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseUnits,
  Hex,
} from "viem";
import { baseSepolia } from "viem/chains";
import contracts from "@/constants/contracts";
import { toast } from "sonner";
import Link from "next/link";

export default function PolicyCard({ policy }: { policy: PolicyTemplate }) {
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();
  const [pending, setPending] = useState<boolean>(false);

  async function buyPolicy() {
    if (!ready) {
      toast.info("Auth not ready");
      return;
    }

    if (!wallets || wallets.length === 0) {
      try {
        connectWallet({
          walletList: ["detected_ethereum_wallets"]
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
      await wallet.switchChain(baseSepolia.id);

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      /// Approve token
      const approveHash = await walletClient.writeContract({
        address: contracts.MUSDC.address,
        abi: contracts.MUSDC.abi,
        functionName: "approve",
        args: [
          policy.contractAddress as Hex,
          parseUnits(policy.premiumAmount, 18),
        ],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      const nextNonce = await publicClient.getTransactionCount({
        address: wallet.address as `0x${string}`,
      });
      console.log("Next nonce:", nextNonce);

      const buyPremium = await walletClient.writeContract({
        address: policy.contractAddress as Hex,
        abi: contracts.PolicyContract.abi,
        functionName: "buyPolicy",
        args: [wallet.address as `0x${string}`, parseUnits("0", 18)],
        nonce: nextNonce,
      });
      const tx = await publicClient.waitForTransactionReceipt({
        hash: buyPremium,
      });
      console.log("Tx: ", tx.transactionHash);

      toast.success("Policy purchased: " + tx.transactionHash);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  }

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
