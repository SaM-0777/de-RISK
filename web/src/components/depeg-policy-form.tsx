/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useConnectWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import contracts from "@/constants/contracts";
import {
  createPublicClient,
  createWalletClient,
  custom,
  Hex,
  http,
  parseUnits,
} from "viem";
import { useBalance } from "@/hooks/use-NFT";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { buyDepegPolicy, payPremium } from "@/app/_actions/policy";
import { parseNFTImage } from "@/utils/nft";
import { usePolicyPurchasedByPolicySlug } from "@/hooks/use-policy";

const formSchema = z.object({
  walletAddress: z
    .string({
      error: "Wallet address is required",
    })
    .length(42, {
      error: "Wallet address must be 42 characters long",
    }),
  depegAsset: z
    .string({
      error: "Depeg asset is required",
    })
    .min(1, {
      error: "Depeg asset must be between 1 and 256 characters",
    })
    .max(256, {
      error: "Depeg asset must be between 1 and 256 characters",
    }),
  network: z.enum(["Ethereum", "Polygon", "Binance Smart Chain"], {
    error: "Network is required",
  }),
});

export default function DepegPolicyForm({
  userPolicyId,
  policy: { contractAddress, premiumAmount, slug },
}: {
  userPolicyId: string | null;
  policy: PolicyTemplate;
}) {
  const { ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();
  const [pending, setPending] = useState<boolean>(false);
  const { userNFT, userNFTIsLoading } = useBalance(contractAddress as Hex);
  const { data, error } = usePolicyPurchasedByPolicySlug(slug);

  useEffect(() => {
    console.log({
      data,
      error,
    });
  }, [data, error]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: user?.wallet?.address ?? "",
      network: "Ethereum",
      depegAsset: "TUSD/TETH",
    },
  });

  useEffect(() => {
    if (ready) {
      form.setValue("walletAddress", user?.wallet?.address ?? "");
    }
  }, [form, ready, user]);

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
    if (!ready) {
      toast.info("Auth not ready");
      return;
    }

    if (!userPolicyId) {
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
          args: [contractAddress as Hex, parseUnits(premiumAmount, 18)],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        const nextNonce = await publicClient.getTransactionCount({
          address: wallet.address as `0x${string}`,
        });

        const payPremiumTx = await walletClient.writeContract({
          address: contractAddress as Hex,
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
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
        args: [contractAddress as Hex, parseUnits(premiumAmount, 18)],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      const nextNonce = await publicClient.getTransactionCount({
        address: wallet.address as `0x${string}`,
      });

      const buyPremiumTx = await walletClient.writeContract({
        address: contractAddress as Hex,
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
          policySlug: slug,
          assetPairAddress: "0x3D4dB4330e4Eb546922088227b5d4CB6BE5cc22a",
          network: data.network,
        },
      });

      if (error) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.error(`buyDepegPolicy failed:`, error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (!ready || userNFTIsLoading) {
    return <div>Loading user balance...</div>;
  }

  return (
    <div className="mt-8">
      {userNFT?.balance && Number(userNFT.balance) ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Your Policy NFT</h2>
          <div className="grid grid-cols-4 gap-4">
            {userNFT?.nfts.map((nft, i) => (
              <Image
                key={i}
                src={parseNFTImage(nft.tokenURI.image)}
                width={256}
                height={256}
                alt="nft"
              />
            ))}
          </div>
          <div>
            <Button type="button" disabled={pending} onClick={handlePayPremium}>
              {`Pay Premium $${premiumAmount}`}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Input</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="0x1234567890123456789012345678901234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your Ethereum wallet address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depegAsset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TUSD/TETH">TUSD/TETH</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!wallets.length ? (
                <Button
                  type="button"
                  disabled={pending}
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || userNFTIsLoading || !ready
                  }
                  className="w-full"
                >
                  {userNFT?.balance && Number(userNFT?.balance) > 0
                    ? `Your balance ${Number(userNFT?.balance)} Pay Premium`
                    : form.formState.isSubmitting
                      ? "Submitting..."
                      : "Buy Policy"}
                </Button>
              )}
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
