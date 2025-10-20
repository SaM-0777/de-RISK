// 3rd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;
//const InsuranceFactory = "0x2808ddf884998c667f9c2ca83e17270d52ba7ad6";
const InsuranceFactory = "0xfbedd9f9cf716e8dbfcfcd1876e5825d0c568e49";

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
// 0xd6e675e813776b0f22ed98a630115eaa235b99bb
