import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const INFURA_RPC_URL = process.env.INFURA_RPC_URL;

export const publicViemClient = createPublicClient({
  chain: sepolia,
  transport: http(INFURA_RPC_URL),
});
