import { createPublicClient, createWalletClient, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

export const publicViemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA_RPC_URL),
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);

export const walletViemClient = createWalletClient({
  transport: http(BASE_SEPOLIA_RPC_URL),
  account: account,
});
