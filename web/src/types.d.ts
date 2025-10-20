type Policy = {
  policyId: string;
  name: string;
  description: string;
  policyContract: `0x${string}`;
  oracle: `0x${string}`;
  premiumAmount: string;
  payoutAmount: string;
};

type PolicyTemplate = {
  id: string;
  slug: string;
  name: string;
  txHash: string;
  description: string;
  contractAddress: string;
  policyId: string;
  premiumAmount: string;
  payoutAmount: string;
  oracleAddress: string;
  coverageTerms: string[];
  formSchema: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type UserPolicyNFT = {
  balance: string;
  nfts: {
    tokenId: string | number;
    tokenURI: {
      name: string;
      description: string;
      image: string;
    };
  }[];
};
