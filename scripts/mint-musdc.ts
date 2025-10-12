import { network } from "hardhat";

const { viem } = await network.connect();

const mUSDC = await viem.deployContract("MUSDC"); //0xe418d073ebd73447689c42c5600b9e654cb97e32
console.log("mUSDC address: ", mUSDC.address);

