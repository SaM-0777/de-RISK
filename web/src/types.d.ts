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
  expiry: Date | string | null;
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
  imageUrl: string;
  premiumAmount: string;
  payoutAmount: string;
  oracleAddress: string;
  coverageTerms: string[];
  formSchema: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
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

type PolicyContractPolicyPurchased = {
  amount: string;      // Example: "10000000000000000000"
  expiry: Date | string;      // Example: "0"
  id: string;          // Example: "11155111_9471422_6"
  owner: string;       // Ethereum address
  policySlug: string;  // Example: "wallet_guard"
  tokenId: string;     // Example: "0"
  tokenURI: string;    // base64-encoded metadata
}