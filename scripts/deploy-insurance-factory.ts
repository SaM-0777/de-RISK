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

console.log("Insurance Factory: ", InsuranceFactory.address); // 0x554b3390adc7c5b8ebe06e04cd16da40de3c2890
