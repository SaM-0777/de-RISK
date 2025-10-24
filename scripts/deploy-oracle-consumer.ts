// 3rd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;
//const InsuranceFactory = "0x2808ddf884998c667f9c2ca83e17270d52ba7ad6";
const InsuranceFactory = "0xd4f3a59a7ad82056d5b73bc5893fa611c10a470a";

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();

const OracleConsumer = await viem.deployContract("OracleConsumer", [
  OWNER,
  OWNER,
  InsuranceFactory
]);

console.log("Oracle Consumer: ", OracleConsumer.address); // 0x25004adf7fff41c900558bf9133aca3aef2f759b
// 0x28aeb75065c35379d1c3c010dba553aa37757e94
