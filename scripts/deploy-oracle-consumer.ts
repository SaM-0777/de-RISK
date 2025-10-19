// 3rd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;
const InsuranceFactory = "0xd4110dd40fbe33f83a219756024a67b4b2b62d1d";

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();

const OracleConsumer = await viem.deployContract("OracleConsumer", [
  OWNER,
  OWNER,
  InsuranceFactory
]);

console.log("Oracle Consumer: ", OracleConsumer.address); // 0xef8b15bc6de1cb9c60fedadeafa2ea3bbfcce5fd
