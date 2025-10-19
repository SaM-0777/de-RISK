// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {PolicyContract} from "./PolicyContract.sol";

interface IPremiumTreasury {
    function addPolicyContract(address policyContract) external;
}

interface IOracleConsumer {
    function registerPolicyContract(
        uint256 policyId,
        address policyContract
    ) external;
}

contract InsuranceFactory is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Policy {
        uint256 policyId;
        string name;
        string description;
        address policyContract;
        address oracle;
        uint256 premiumAmount;
        uint256 payoutAmount;
    }

    mapping(uint256 => Policy) public policies;
    uint256 public policyCount;

    event PolicyCreated(uint256 policyId, address policyContract, string name, string imageUrl);
    event PolicyUpdated(
        uint256 policyId,
        uint256 premiumAmount,
        uint256 payoutAmount
    );

    constructor(address _admin) {
        _grantRole(ADMIN_ROLE, _admin);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
    }

    function createPolicy(
        string memory name,
        string memory description,
        string memory imageUrl,
        address oracle,
        address treasury,
        address mUSDC,
        uint256 premiumAmount,
        uint256 payoutAmount
    ) external onlyRole(ADMIN_ROLE) returns (uint256 policyId) {
        policyId = policyCount++;

        PolicyContract policyContract = new PolicyContract(
            name,
            description,
            imageUrl,
            policyId,
            oracle,
            treasury,
            mUSDC,
            premiumAmount,
            payoutAmount
        );

        policies[policyId] = Policy({
            policyId: policyId,
            name: name,
            description: description,
            policyContract: address(policyContract),
            oracle: oracle,
            premiumAmount: premiumAmount,
            payoutAmount: payoutAmount
        });

        IPremiumTreasury(treasury).addPolicyContract(address(policyContract));
        IOracleConsumer(oracle).registerPolicyContract(
            policyId,
            address(policyContract)
        );

        emit PolicyCreated(policyId, address(policyContract), name, imageUrl);
    }

    function updatePolicy(
        uint256 policyId,
        uint256 premiumAmount,
        uint256 payoutAmount
    ) external onlyRole(ADMIN_ROLE) {
        require(policyId < policyCount, "Invalid Policy");
        require(premiumAmount > 0 && payoutAmount > 0, "Invalid amount");

        policies[policyId].premiumAmount = premiumAmount;
        policies[policyId].payoutAmount = payoutAmount;

        PolicyContract(policies[policyId].policyContract).updateParams(
            premiumAmount,
            payoutAmount
        );

        emit PolicyUpdated(policyId, premiumAmount, payoutAmount);
    }

    function getAllPolicies() external view returns (Policy[] memory) {
        Policy[] memory allPolicies = new Policy[](policyCount);
        for (uint256 i = 0; i < policyCount; i++) {
            allPolicies[i] = policies[i];
        }

        return allPolicies;
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(policyId < policyCount, "Invalid Policy");
        return policies[policyId];
    }
}
