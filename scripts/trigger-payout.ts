import { network } from "hardhat";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const OracleConsumerAddress = "0xc8F93E138cfa045eFd864eD9DC1623FB1DB79802";

const OracleConsumer = await viem.getContractAt(
  "OracleConsumer",
  OracleConsumerAddress
);

const SignerAddress = await OracleConsumer.read.trustedSigner();




