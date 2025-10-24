import { network } from "hardhat";
import { parseUnits } from "viem";

const OWNER = process.env.OWNER as `0x${string}`;

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const mUSDCAddress = "0xe418d073ebd73447689c42c5600b9e654cb97e32";
const InsuranceFactoryAddress = "0xd4110dd40fbe33f83a219756024a67b4b2b62d1d";
const PremiumTreasuryAddress = "0xcb325d226b843dd3dae0c9065a0e7b102374803d";
const OracleConsumerAddress = "0xef8b15bc6de1cb9c60fedadeafa2ea3bbfcce5fd";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient(OWNER);

const InsuranceFactoryContract = await viem.getContractAt(
  "InsuranceFactory",
  InsuranceFactoryAddress
);

const InsuranceFactoryAdminRole = InsuranceFactoryContract.read.ADMIN_ROLE;
const InsuranceFactoryAdmin = await InsuranceFactoryAdminRole();
console.log({ InsuranceFactoryAdmin });

const LPHackPremiumAmount = parseUnits("10", 18); // 1 mUSDC
const LPHackPayoutAmount = parseUnits("100", 18); // 2 mUSDC
const FlightDelayPremiumAmount = parseUnits("10", 18); // 1 mUSDC
const FlightDelayPayoutAmount = parseUnits("20", 18); // 2 mUSDC

const DepegPolicyNFT =
  "https://drive.usercontent.google.com/download?id=1c-NfSZlwKIkvGQlnHAeZw8hsqEMCNqGz&export=view";

const LPHackPolicyArgs = [
  // 0xf69594f5d50b40d9f5f9468003897c0d84c1cbc4
  "LP Hack",
  "Insure against LP Manipulation",
  OracleConsumerAddress,
  PremiumTreasuryAddress,
  mUSDCAddress,
  LPHackPremiumAmount,
  LPHackPayoutAmount,
]; // 0xe5200a577cabff01fb94c8bcd4c5cdd2ae720200b16781b819475da74f062993
const FlightDelayPolicyArgs = [
  // 0x40c91075f588ffc0aab27bb862540d1cf77ff413
  "Flight Delay",
  "Insure against Flight Delay",
  OracleConsumerAddress,
  PremiumTreasuryAddress,
  mUSDCAddress,
  FlightDelayPremiumAmount,
  FlightDelayPayoutAmount,
]; // 0x74dba97230c68c6d2d0b1d830b654255cca50aa3082ecd58dc67ed85fdb755d7

const approveTx = await walletClient.writeContract({
  address: InsuranceFactoryAddress,
  abi: InsuranceFactoryContract.abi,
  functionName: "createPolicy",
  args: [
    "DePeg Insurance",
    "Insure against Depeg",
    DepegPolicyNFT,
    OracleConsumerAddress,
    PremiumTreasuryAddress,
    mUSDCAddress,
    LPHackPremiumAmount,
    LPHackPayoutAmount,
  ],
});

const tx = await publicClient.waitForTransactionReceipt({ hash: approveTx });
console.log("Tx: ", tx.transactionHash);
