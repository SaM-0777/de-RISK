import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

export const publicViemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA_RPC_URL),
});
