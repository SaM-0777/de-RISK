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

console.log("Insurance Factory: ", InsuranceFactory.address); // 0x2808ddf884998c667f9c2ca83e17270d52ba7ad6

// 0x8a806c901f73826b1666c9e752c597e583c800ce
