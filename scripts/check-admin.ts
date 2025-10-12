import { network } from "hardhat";

const InsuranceFactoryAddress = "0x554b3390adc7c5b8ebe06e04cd16da40de3c2890";
const ADMIN_ROLE =
  "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775"; // keccak256("ADMIN_ROLE")

const addressToCheck = process.env.OWNER as `0x${string}`;

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const InsuranceFactory = await viem.getContractAt("InsuranceFactory", InsuranceFactoryAddress);

const isAdmin = await publicClient.readContract({
  address: InsuranceFactoryAddress,
  abi: InsuranceFactory.abi,
  functionName: "hasRole",
  args: [ADMIN_ROLE, addressToCheck],
});

console.log(`${addressToCheck}: `, isAdmin);
