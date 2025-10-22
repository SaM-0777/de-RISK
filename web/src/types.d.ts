type Policy = {
  policyId: string;
  name: string;
  description: string;
  policyContract: `0x${string}`;
  oracle: `0x${string}`;
  premiumAmount: string;
  payoutAmount: string;
};

type UserPolicy = {
  id: string;
  policyTemplateSlug: string;
  ownerAddress: string;
  tokenId: string;
  tokenURI: string;
  expiry: string | null;
  txHash: string;
  premiumPaid: string;
  status: "pending" | "verified";
  claimStatus: "claimed" | "active";
  inputs:
    | {
        network: string;
        assetPairAddress: string;
      }
    | {
        flightNumber: string;
        date: string;
      };
  createdAt: string;
  updatedAt: string;
};

type Premium = {
  id: string;
  policyTemplateSlug: string;
  userPolicyId: string;
  ownerAddress: string;
  txHash: string;
  premiumPaid: string;
  createdAt: string;
  updatedAt: string;
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
