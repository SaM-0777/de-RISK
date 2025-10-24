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
// 0xd4f3a59a7ad82056d5b73bc5893fa611c10a470a
