import { network } from "hardhat";

const { viem } = await network.connect();

const mUSDC = await viem.deployContract("MUSDC"); //0xe418d073ebd73447689c42c5600b9e654cb97e32
console.log("mUSDC address: ", mUSDC.address);
// 0x3af0659f4496bf9a98308ec16219e8594aa4df27

