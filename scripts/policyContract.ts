import {
  createPublicClient,
  createWalletClient,
  getContract,
  Hex,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import MUSDCJson from "../artifacts/contracts/mUSDC.sol/MUSDC.json";
import PolicyContractJson from "../artifacts/contracts/PolicyContract.sol/PolicyContract.json";

// bunx --bun harhdhat node

//Account #0:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
//Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

const accountDeployer = privateKeyToAccount(
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
);

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

const deployerClient = createWalletClient({
  account: accountDeployer,
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

// deploy musdc
const DeployMUSDC = await deployerClient.deployContract({
  abi: MUSDCJson.abi,
  bytecode: MUSDCJson.bytecode as Hex,
});

const deployMsudcReceipt = await publicClient.waitForTransactionReceipt({
  hash: DeployMUSDC,
});
console.log(`MUSDC address: ${deployMsudcReceipt.contractAddress}`);

const MUSDC = getContract({
  abi: MUSDCJson.abi,
  address: deployMsudcReceipt.contractAddress ?? ("" as Hex),
  client: publicClient,
});

const name = "LP Hack";
const description = "Insurance against LP Hack";
const imageUrl =
  "https://drive.usercontent.google.com/download?id=1c-NfSZlwKIkvGQlnHAeZw8hsqEMCNqGz&export=view";
const policyId = 1n;
const oracle = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const treasury = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";
const mUSDC = MUSDC.address;
const premiumAmount = 100n;
const payoutAmount = 1000n;

const DeployedPolicyContract = await deployerClient.deployContract({
  abi: PolicyContractJson.abi,
  bytecode: PolicyContractJson.bytecode as Hex,
  args: [
    name,
    description,
    imageUrl,
    policyId,
    oracle,
    treasury,
    mUSDC,
    premiumAmount,
    payoutAmount,
  ],
});

const deployReceipt = await publicClient.waitForTransactionReceipt({
  hash: DeployedPolicyContract,
});

const PolicyContract = getContract({
  abi: PolicyContractJson.abi,
  address: deployReceipt.contractAddress ?? ("" as Hex),
  client: publicClient,
});

console.log(`PolicyContract ${deployReceipt.contractAddress}`);

for (const log of deployReceipt.logs) {
  console.log(log.topics, log.data)
}

// USER

const accountUser = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

console.log("User: ", accountUser.address);

// Transfer mUSDC to user
const amount = parseUnits("100000", 18);
const transferTx = await MUSDC.write.transfer([accountUser.address, amount], {
  account: deployerClient.account,
  client: deployerClient
});
const transferReceipt = await publicClient.waitForTransactionReceipt({
  hash: transferTx,
});
console.log(`Transfered MUSDC `, transferReceipt.transactionHash);

const userClient = createWalletClient({
  account: accountUser,
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

// approve MSUDC
const approveTx = await userClient.writeContract({
  address: mUSDC,
  abi: MUSDCJson.abi,
  functionName: "approve",
  args: [PolicyContract.address, parseUnits("10000", 18)],
});

const approveReceipt = await publicClient.waitForTransactionReceipt({
  hash: approveTx,
});
console.log(`Approved MUSDC `, approveReceipt.transactionHash);

const tx = await userClient.writeContract({
  abi: PolicyContract.abi,
  address: PolicyContract.address,
  functionName: "buyPolicy",
  args: [accountUser.address, 0n],
});

console.log("Policy NFT Tx: ", tx);

const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

console.log({ receipt });
for (const log of receipt.logs) {
  console.log(log.topics, log.data)
}

const balance = await PolicyContract.read.balanceOf([accountUser.address]);
console.log({balance: Number(balance)})
const nfts = [];

for (let index = 0; index < Number(balance); index++) {
  const tokenId = await PolicyContract.read.tokenOfOwnerByIndex([
    accountUser.address,
    BigInt(index),
  ]);
  const tokenURI = await PolicyContract.read.tokenURI([
    BigInt(tokenId as bigint),
  ]) as string;
  const jsonTokenURI = Buffer.from(tokenURI.replace("data:application/json;base64,", ""), "base64").toString("utf-8");
  console.log({jsonTokenURI})
  nfts.push({ tokenId: Number(tokenId), tokenURI: JSON.parse(jsonTokenURI) });
}

console.log(nfts);
