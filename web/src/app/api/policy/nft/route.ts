/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { authorization } from "@/lib/authorization";
import z from "zod";
import { createPublicClient, getContract, Hex, http } from "viem";
import { sepolia } from "viem/chains";
import contracts from "@/constants/contracts";
import { parseTokenURI } from "@/utils/nft";
//import { getCacheValue, setCacheValue } from "@/lib/cache";

export const runtime = 'nodejs'
export const maxDuration = 25

const INFURA_RPC_URL = process.env.INFURA_RPC_URL;

export async function POST(request: NextRequest) {
  try {
    const auth = await authorization();
    if (!auth?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();
    const validatedBody = z
      .object({
        userWalletAddress: z
          .string({ error: "Invalid wallet address" })
          .length(42, { error: "EVM wallet address must be of length 42" }),
        policyAddress: z
          .string({ error: "Invalid policy address" })
          .length(42, { error: "Policy address must be of length 42" }),
      })
      .safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { policyAddress, userWalletAddress } = validatedBody.data;

    //const key = `nft-${userWalletAddress}-${policyAddress}`;
    //const cachedData = await getCacheValue(key);
    //if (cachedData) {
    //  return NextResponse.json(cachedData, { status: 200 });
    //}

    const publicClient = createPublicClient({
      transport: http(INFURA_RPC_URL),
      chain: sepolia,
    });

    const PolicyContract = getContract({
      abi: contracts.PolicyContract.abi,
      address: policyAddress as Hex,
      client: publicClient,
    });

    // fetch user nft
    const nftBalance = await publicClient.readContract({
      abi: contracts.PolicyContract.abi,
      address: policyAddress as Hex,
      functionName: "balanceOf",
      args: [userWalletAddress as Hex],
    });

    const nfts = [];

    if (Number(nftBalance)) {
      for (let index = 0; index < Number(nftBalance); index++) {
        const tokenId = await PolicyContract.read.tokenOfOwnerByIndex([
          userWalletAddress as Hex,
          BigInt(index),
        ]);
        const tokenURI = await PolicyContract.read.tokenURI([tokenId]);
        const jsonTokenURI = parseTokenURI(tokenURI);
        nfts.push({
          tokenId: Number(tokenId),
          tokenURI: jsonTokenURI,
        });
      }
    }

    const response = {
      balance: nftBalance.toString(),
      nfts,
    };

    //await setCacheValue(key, response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`src.app.api.policy.nft.route.error ${error}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
