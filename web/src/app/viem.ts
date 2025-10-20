import { createPublicClient, createWalletClient, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const INFURA_RPC_URL = process.env.INFURA_RPC_URL;

export const publicViemClient = createPublicClient({
  chain: sepolia,
  transport: http(INFURA_RPC_URL),
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);

export const walletViemClient = createWalletClient({
  transport: http(INFURA_RPC_URL),
  account: account,
});
