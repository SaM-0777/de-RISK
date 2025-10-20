import { createPublicClient, Hex, http } from "viem";
import { mainnet } from "viem/chains";
import { ppabi } from "../pp.js";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const ETHERSCAN = process.env.ETHERSCAN;
const PUDGY_PENGUINS_ADDRESS =
  "0xbd3531da5cf5857e7cfaa92426877b022e612cf8" as Hex;

async function getMetadata(tokenId: bigint): Promise<void> {
  //const tokenURI = await client.readContract({
  //  address: PUDGY_PENGUINS_ADDRESS,
  //  abi,
  //  functionName: "tokenURI",
  //  args: [tokenId],
  //}) as string;
  const tokenURI = await client.readContract({
    abi: ppabi,
    args: [
      tokenId
    ],
    address: PUDGY_PENGUINS_ADDRESS,
    functionName: "tokenURI"
  })

  console.log(`Token URI for #${tokenId}:`, tokenURI);

  const response = await fetch(tokenURI);
  const metadata = await response.json();
  console.log(`Metadata for #${tokenId}:`, metadata);
}

// Example usage for token ID 7269
getMetadata(BigInt(7269)).catch(console.error);
