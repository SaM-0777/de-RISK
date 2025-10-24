/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  InsuranceFactory,
  InsuranceFactory_PolicyCreated,
  InsuranceFactory_PolicyUpdated,
  InsuranceFactory_RoleAdminChanged,
  InsuranceFactory_RoleGranted,
  InsuranceFactory_RoleRevoked,
  MUSDC,
  MUSDC_Approval,
  MUSDC_OwnershipTransferred,
  MUSDC_Transfer,
  OracleConsumer,
  OracleConsumer_ClaimStatusUpdated,
  OracleConsumer_EIP712DomainChanged,
  OracleConsumer_RoleAdminChanged,
  OracleConsumer_RoleGranted,
  OracleConsumer_RoleRevoked,
  PolicyContract,
  PolicyContract_Approval,
  PolicyContract_ApprovalForAll,
  PolicyContract_BatchMetadataUpdate,
  PolicyContract_ClaimProcessed,
  PolicyContract_MetadataUpdate,
  PolicyContract_ParamsUpdated,
  PolicyContract_PolicyPurchased,
  PolicyContract_PremiumPaid,
  PolicyContract_RoleAdminChanged,
  PolicyContract_RoleGranted,
  PolicyContract_RoleRevoked,
  PolicyContract_Transfer,
  PremiumTreasury,
  PremiumTreasury_PayoutSent,
  PremiumTreasury_PremiumReceived,
  PremiumTreasury_RoleAdminChanged,
  PremiumTreasury_RoleGranted,
  PremiumTreasury_RoleRevoked,
} from "generated";

InsuranceFactory.PolicyCreated.handler(async ({ event, context }) => {
  const entity: InsuranceFactory_PolicyCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    policyId: event.params.policyId,
    policyContract: event.params.policyContract,
    name: event.params.name,
    slug: event.params.slug,
    imageUrl: event.params.imageUrl,
  };

  context.InsuranceFactory_PolicyCreated.set(entity);
});

InsuranceFactory.PolicyUpdated.handler(async ({ event, context }) => {
  const entity: InsuranceFactory_PolicyUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    policyId: event.params.policyId,
    premiumAmount: event.params.premiumAmount,
    payoutAmount: event.params.payoutAmount,
  };

  context.InsuranceFactory_PolicyUpdated.set(entity);
});

InsuranceFactory.RoleAdminChanged.handler(async ({ event, context }) => {
  const entity: InsuranceFactory_RoleAdminChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    previousAdminRole: event.params.previousAdminRole,
    newAdminRole: event.params.newAdminRole,
  };

  context.InsuranceFactory_RoleAdminChanged.set(entity);
});

InsuranceFactory.RoleGranted.handler(async ({ event, context }) => {
  const entity: InsuranceFactory_RoleGranted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.InsuranceFactory_RoleGranted.set(entity);
});

InsuranceFactory.RoleRevoked.handler(async ({ event, context }) => {
  const entity: InsuranceFactory_RoleRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.InsuranceFactory_RoleRevoked.set(entity);
});

MUSDC.Approval.handler(async ({ event, context }) => {
  const entity: MUSDC_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
  };

  context.MUSDC_Approval.set(entity);
});

MUSDC.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: MUSDC_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.MUSDC_OwnershipTransferred.set(entity);
});

MUSDC.Transfer.handler(async ({ event, context }) => {
  const entity: MUSDC_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
  };

  context.MUSDC_Transfer.set(entity);
});

OracleConsumer.ClaimStatusUpdated.handler(async ({ event, context }) => {
  const entity: OracleConsumer_ClaimStatusUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    policyId: event.params.policyId,
    tokenId: event.params.tokenId,
    claimable: event.params.claimable,
  };

  context.OracleConsumer_ClaimStatusUpdated.set(entity);
});

OracleConsumer.EIP712DomainChanged.handler(async ({ event, context }) => {
  const entity: OracleConsumer_EIP712DomainChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  };

  context.OracleConsumer_EIP712DomainChanged.set(entity);
});

OracleConsumer.RoleAdminChanged.handler(async ({ event, context }) => {
  const entity: OracleConsumer_RoleAdminChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    previousAdminRole: event.params.previousAdminRole,
    newAdminRole: event.params.newAdminRole,
  };

  context.OracleConsumer_RoleAdminChanged.set(entity);
});

OracleConsumer.RoleGranted.handler(async ({ event, context }) => {
  const entity: OracleConsumer_RoleGranted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.OracleConsumer_RoleGranted.set(entity);
});

OracleConsumer.RoleRevoked.handler(async ({ event, context }) => {
  const entity: OracleConsumer_RoleRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.OracleConsumer_RoleRevoked.set(entity);
});

PolicyContract.Approval.handler(async ({ event, context }) => {
  const entity: PolicyContract_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.PolicyContract_Approval.set(entity);
});

PolicyContract.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: PolicyContract_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.PolicyContract_ApprovalForAll.set(entity);
});

PolicyContract.BatchMetadataUpdate.handler(async ({ event, context }) => {
  const entity: PolicyContract_BatchMetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _fromTokenId: event.params._fromTokenId,
    _toTokenId: event.params._toTokenId,
  };

  context.PolicyContract_BatchMetadataUpdate.set(entity);
});

PolicyContract.ClaimProcessed.handler(async ({ event, context }) => {
  const entity: PolicyContract_ClaimProcessed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenId: event.params.tokenId,
    owner: event.params.owner,
    amount: event.params.amount,
    success: event.params.success,
    policySlug: event.params.policySlug,
  };

  context.PolicyContract_ClaimProcessed.set(entity);
});

PolicyContract.MetadataUpdate.handler(async ({ event, context }) => {
  const entity: PolicyContract_MetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _tokenId: event.params._tokenId,
  };

  context.PolicyContract_MetadataUpdate.set(entity);
});

PolicyContract.ParamsUpdated.handler(async ({ event, context }) => {
  const entity: PolicyContract_ParamsUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    premiumAmount: event.params.premiumAmount,
    payoutAmount: event.params.payoutAmount,
    policySlug: event.params.policySlug,
  };

  context.PolicyContract_ParamsUpdated.set(entity);
});

PolicyContract.PolicyPurchased.handler(async ({ event, context }) => {
  const entity: PolicyContract_PolicyPurchased = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenId: event.params.tokenId,
    owner: event.params.owner,
    expiry: event.params.expiry,
    amount: event.params.amount,
    tokenURI: event.params.tokenURI,
    policySlug: event.params.policySlug,
  };

  context.PolicyContract_PolicyPurchased.set(entity);
});

PolicyContract.PremiumPaid.handler(async ({ event, context }) => {
  const entity: PolicyContract_PremiumPaid = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenId: event.params.tokenId,
    amount: event.params.amount,
    policySlug: event.params.policySlug,
  };

  context.PolicyContract_PremiumPaid.set(entity);
});

PolicyContract.RoleAdminChanged.handler(async ({ event, context }) => {
  const entity: PolicyContract_RoleAdminChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    previousAdminRole: event.params.previousAdminRole,
    newAdminRole: event.params.newAdminRole,
  };

  context.PolicyContract_RoleAdminChanged.set(entity);
});

PolicyContract.RoleGranted.handler(async ({ event, context }) => {
  const entity: PolicyContract_RoleGranted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.PolicyContract_RoleGranted.set(entity);
});

PolicyContract.RoleRevoked.handler(async ({ event, context }) => {
  const entity: PolicyContract_RoleRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.PolicyContract_RoleRevoked.set(entity);
});

PolicyContract.Transfer.handler(async ({ event, context }) => {
  const entity: PolicyContract_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.PolicyContract_Transfer.set(entity);
});

PremiumTreasury.PayoutSent.handler(async ({ event, context }) => {
  const entity: PremiumTreasury_PayoutSent = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenId: event.params.tokenId,
    recipient: event.params.recipient,
    amount: event.params.amount,
  };

  context.PremiumTreasury_PayoutSent.set(entity);
});

PremiumTreasury.PremiumReceived.handler(async ({ event, context }) => {
  const entity: PremiumTreasury_PremiumReceived = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    policyContract: event.params.policyContract,
    amount: event.params.amount,
  };

  context.PremiumTreasury_PremiumReceived.set(entity);
});

PremiumTreasury.RoleAdminChanged.handler(async ({ event, context }) => {
  const entity: PremiumTreasury_RoleAdminChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    previousAdminRole: event.params.previousAdminRole,
    newAdminRole: event.params.newAdminRole,
  };

  context.PremiumTreasury_RoleAdminChanged.set(entity);
});

PremiumTreasury.RoleGranted.handler(async ({ event, context }) => {
  const entity: PremiumTreasury_RoleGranted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.PremiumTreasury_RoleGranted.set(entity);
});

PremiumTreasury.RoleRevoked.handler(async ({ event, context }) => {
  const entity: PremiumTreasury_RoleRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  };

  context.PremiumTreasury_RoleRevoked.set(entity);
});
