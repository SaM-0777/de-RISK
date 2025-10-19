/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import contracts from "@/contracts";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPublicClient, Hex, http } from "viem";
import { baseSepolia } from "viem/chains";

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

export function useBalance(
  policyAddress: Hex,
  policyAbi: typeof contracts.PolicyContract.abi
) {
  const { user } = usePrivy();
  const [balance, setBalance] = useState<number>(0);
  const [pendingBalance, setPendingBalance] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (user?.wallet?.address) {
      checkNFT();
    }
  }, [user?.wallet?.address, policyAddress]);

  async function checkNFT() {
    if (!user?.wallet?.address) return;

    setPendingBalance(true);

    try {
      const publicViemClient = createPublicClient({
        chain: baseSepolia,
        transport: http(BASE_SEPOLIA_RPC_URL),
      });

      const balance = await publicViemClient.readContract({
        abi: policyAbi,
        address: policyAddress,
        functionName: "balanceOf",
        args: [user.wallet.address as Hex],
      });

      setBalance(Number(balance));
    } catch (error) {
      toast.error(`An error occured while fetching user balance`);
      setError("An error occured while fetching user balance");
    } finally {
      setPendingBalance(false);
    }
  }

  return {
    balance,
    pendingBalance,
    error,
  };
}
