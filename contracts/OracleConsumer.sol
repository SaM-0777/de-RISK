// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IPolicyContract {
    function updateClaimStatus(uint256 tokenId, bool claimable) external;
}

contract OracleConsumer is AccessControl, EIP712 {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CLAIM_TYPEHASH =
        keccak256(
            "ClaimRequest(uint256 policyTypeId,uint256 tokenId,bool claimable,uint256 timestamp)"
        );

    address public trustedSigner; //
    mapping(uint256 => address) public policyContracts;
    mapping(uint256 => mapping(uint256 => bool)) public claimable;

    event ClaimStatusUpdated(uint256 policyId, uint256 tokenId, bool claimable);

    constructor(
        address _trustedSigner,
        address admin,
        address insuranceFactory
    ) EIP712("OracleConsumer", "1") {
        trustedSigner = _trustedSigner;
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, insuranceFactory);
    }

    function grantRole(
        bytes32 role,
        address account
    ) public override onlyRole(ADMIN_ROLE) {
        // to set Insurance factory as admin
        _grantRole(role, account);
    }

    function setTrustedSigner(address newSigner) external onlyRole(ADMIN_ROLE) {
        trustedSigner = newSigner;
    }

    function registerPolicyContract(
        uint256 policyId,
        address policyContract
    ) external onlyRole(ADMIN_ROLE) {
        policyContracts[policyId] = policyContract;
    }

    function updateClaimStatus(
        uint256 policyTypeId,
        uint256 tokenId,
        bool claimableStatus,
        uint256 timestamp,
        bytes memory signature
    ) external {
        require(timestamp > block.timestamp - 1 hours, "Signature expired");
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    CLAIM_TYPEHASH,
                    policyTypeId,
                    tokenId,
                    claimableStatus,
                    timestamp
                )
            )
        );
        require(
            ECDSA.recover(digest, signature) == trustedSigner,
            "Invalid signature"
        );

        claimable[policyTypeId][tokenId] = claimableStatus;
        address policyContract = policyContracts[policyTypeId];
        require(policyContract != address(0), "Invalid policy type");
        IPolicyContract(policyContract).updateClaimStatus(
            tokenId,
            claimableStatus
        );
        emit ClaimStatusUpdated(policyTypeId, tokenId, claimableStatus);
    }

    function isClaimable(
        uint256 policyTypeId,
        uint256 tokenId
    ) external view returns (bool) {
        return claimable[policyTypeId][tokenId];
    }
}
