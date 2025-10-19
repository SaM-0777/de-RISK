// 2nd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();
const mUSDC = "0xe418d073ebd73447689c42c5600b9e654cb97e32";
const InsuranceFactory = "0x2808ddf884998c667f9c2ca83e17270d52ba7ad6";

const PremiumTreasury = await viem.deployContract("PremiumTreasury", [
  mUSDC,
  OWNER,
  InsuranceFactory,
]);

console.log("PremiumTreasury address: ", PremiumTreasury.address); // 0x93f7ac5f7f1761bd9764418a46927625182e748e

//const DeployedPremiumTreasury = await viem.getContractAt(
//  "PremiumTreasury",
//  PremiumTreasury.address
//);
//const ADMIN_ROLE = await DeployedPremiumTreasury.read.ADMIN_ROLE();

//console.log(`DeployedPremiumTreasury ADMIN_ROLE: ${ADMIN_ROLE}`);

//const GrantRoleToInsuranceFactoryHash = await walletClient.writeContract({
//  address: PremiumTreasury.address,
//  abi: PremiumTreasury.abi,
//  functionName: "grantRole",
//  args: [ADMIN_ROLE, InsuranceFactory],
//});

//const receipt = await publicClient.waitForTransactionReceipt({
//  hash: GrantRoleToInsuranceFactoryHash,
//});
//console.log(
//  `Successfully granted role to ${InsuranceFactory}, hash: ${receipt.transactionHash}`
//);
