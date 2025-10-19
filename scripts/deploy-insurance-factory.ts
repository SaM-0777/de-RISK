// 1st step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();

const InsuranceFactory = await viem.deployContract("InsuranceFactory", [
  OWNER
]);

console.log("Insurance Factory: ", InsuranceFactory.address); // 0xd4110dd40fbe33f83a219756024a67b4b2b62d1d
