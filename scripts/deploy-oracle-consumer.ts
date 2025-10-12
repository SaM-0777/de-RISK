// 3rd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;
const InsuranceFactory = "0x554b3390adc7c5b8ebe06e04cd16da40de3c2890";

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();

const OracleConsumer = await viem.deployContract("OracleConsumer", [
  OWNER,
  OWNER,
  InsuranceFactory
]);

console.log("Oracle Consumer: ", OracleConsumer.address); // 0xc8f93e138cfa045efd864ed9dc1623fb1db79802
