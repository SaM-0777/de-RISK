import { network } from "hardhat";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const OracleConsumerAddress = "0xd6e675e813776b0f22ed98a630115eaa235b99bb";

const OracleConsumer = await viem.getContractAt(
  "OracleConsumer",
  OracleConsumerAddress
);






