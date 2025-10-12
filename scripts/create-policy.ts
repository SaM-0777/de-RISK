import { network } from "hardhat";
import { parseUnits } from "viem";

const OWNER = process.env.OWNER as `0x${string}`;

if (!OWNER) {
  throw new Error("OWNER is undefined");
}

const mUSDCAddress = "0xe418d073ebd73447689c42c5600b9e654cb97e32";
const InsuranceFactoryAddress = "0x554b3390adc7c5b8ebe06e04cd16da40de3c2890";
const PremiumTreasuryAddress = "0xFF401F2A0D238ab71f6EbbBE2E3bAF6728Dd313E";
const OracleConsumerAddress = "0xc8F93E138cfa045eFd864eD9DC1623FB1DB79802";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient(OWNER);

const InsuranceFactoryContract = await viem.getContractAt(
  "InsuranceFactory",
  InsuranceFactoryAddress
);

const LPHackPremiumAmount = parseUnits("1", 18); // 1 mUSDC
const LPHackPayoutAmount = parseUnits("2", 18); // 2 mUSDC
const FlightDelayPremiumAmount = parseUnits("10", 18); // 1 mUSDC
const FlightDelayPayoutAmount = parseUnits("20", 18); // 2 mUSDC

const LPHackPolicyArgs = [ // 0xf69594f5d50b40d9f5f9468003897c0d84c1cbc4
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
    "LP Hack",
    "Insure against LP Manipulation",
    OracleConsumerAddress,
    PremiumTreasuryAddress,
    mUSDCAddress,
    LPHackPremiumAmount,
    LPHackPayoutAmount,
  ],
});

const tx = await publicClient.waitForTransactionReceipt({ hash: approveTx });
console.log("Tx: ", tx.transactionHash);
