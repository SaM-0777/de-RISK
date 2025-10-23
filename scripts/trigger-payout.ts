import { network } from "hardhat";
import { createWalletClient, Hex, http, verifyTypedData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const account = privateKeyToAccount(PRIVATE_KEY as Hex);

const walletClient = createWalletClient({
  transport: http(process.env.INFURA_RPC_URL),
  account,
});

const MSUDCAddress = "0x3af0659f4496bf9a98308ec16219e8594aa4df27";
const OracleConsumerAddress = "0x28aeb75065c35379d1c3c010dba553aa37757e94";

const MSUDC = await viem.getContractAt("MUSDC", MSUDCAddress);
const OracleConsumer = await viem.getContractAt(
  "OracleConsumer",
  OracleConsumerAddress
);

const domain = {
  name: "OracleConsumer",
  version: "1",
  chainId: sepolia.id,
  verifyingContract: OracleConsumerAddress as Hex,
};

const timestamp = BigInt(Math.floor(Date.now() / 1000));

const types = {
  ClaimRequest: [
    { name: "policyTypeId", type: "uint256" },
    { name: "tokenId", type: "uint256" },
    { name: "claimable", type: "bool" },
    { name: "timestamp", type: "uint256" },
  ],
};

const message = {
  policyTypeId: 0n,
  tokenId: 0n,
  claimable: true,
  timestamp,
};

const signature = await walletClient.signTypedData({
  message,
  domain,
  types,
  primaryType: "ClaimRequest",
  account,
});

const verify = await verifyTypedData({
  address: account.address,
  domain,
  message,
  types,
  signature,
  primaryType: "ClaimRequest",
});

console.log({
  verify,
});

//const currentNonce = await publicClient.getTransactionCount({
//  address: account.address,
//});

//const allowance = await walletClient.writeContract({
//  abi: MSUDC.abi, // standard ERC-20 ABI
//  address: MSUDC.address, // address of mUSDC token
//  functionName: "approve",
//  nonce: currentNonce,
//  chain: sepolia,
//  args: ["0xE43d7B0fF7A2228A930410a0e04f6d50b1350C3d", 1000n], // allow PolicyContract to spend
//});
//await publicClient.waitForTransactionReceipt({ hash: allowance });

const updatedNonce = await publicClient.getTransactionCount({
  address: account.address,
});

const tx = await walletClient.writeContract({
  abi: OracleConsumer.abi,
  address: OracleConsumer.address,
  chain: sepolia,
  functionName: "updateClaimStatus",
  nonce: updatedNonce,
  args: [0n, 0n, true, timestamp, signature],
});

const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
console.log({
  receipt,
});
