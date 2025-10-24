import { network } from "hardhat";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const USER = "0x8D012ECAdD409C0A6F6c9377256a189512f2aE40" as `0x${string}`;
const mUSDCAddress =
  "0xe418d073ebd73447689c42c5600b9e654cb97e32" as `0x${string}`;
const PolicyAddress =
  "0xd748a089Bf750E32863e6EB33e80D717E021A3B6" as `0x${string}`;

const { viem } = await network.connect();

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const publicClient = await viem.getPublicClient();
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

const PolicyContract = await viem.getContractAt(
  "PolicyContract",
  PolicyAddress
);
const mUSDCContract = await viem.getContractAt("MUSDC", mUSDCAddress);

const tokenTx = await walletClient.writeContract({
  address: mUSDCAddress,
  abi: mUSDCContract.abi,
  functionName: "approve",
  args: [PolicyAddress, parseUnits("1000", 18)], // approve enough
});
const rcpt = await publicClient.waitForTransactionReceipt({ hash: tokenTx });
console.log("Approve Tx: ", rcpt.transactionHash);

const nextNonce = await publicClient.getTransactionCount({
  address: account.address,
});
console.log("Next nonce:", nextNonce);

const approveTx = await walletClient.writeContract({
  address: PolicyAddress,
  abi: PolicyContract.abi,
  functionName: "payPremium",
  args: [parseUnits("0", 18)],
  //nonce: nextNonce,
});

const tx = await publicClient.waitForTransactionReceipt({ hash: approveTx });
console.log("Tx: ", tx.transactionHash);
