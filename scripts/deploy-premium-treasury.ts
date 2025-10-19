// 2nd step

import { network } from "hardhat";

const OWNER = process.env.OWNER as `0x${string}`;

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const { viem } = await network.connect();
const mUSDC = "0xe418d073ebd73447689c42c5600b9e654cb97e32";
const InsuranceFactory = "0xd4110dd40fbe33f83a219756024a67b4b2b62d1d";

const PremiumTreasury = await viem.deployContract("PremiumTreasury", [
  mUSDC,
  OWNER,
  InsuranceFactory,
]);

console.log("PremiumTreasury address: ", PremiumTreasury.address); // 0xcb325d226b843dd3dae0c9065a0e7b102374803d

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
