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

// 0xfbedd9f9cf716e8dbfcfcd1876e5825d0c568e49
