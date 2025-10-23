// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PremiumTreasury is AccessControl {
    bytes32 public constant POLICY_CONTRACT_ROLE =
        keccak256("POLICY_CONTRACT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public mUSDC;
    mapping(address => bool) public policyContracts;

    event PremiumReceived(address policyContract, uint256 amount);
    event PayoutSent(uint256 tokenId, address recipient, uint256 amount);

    constructor(address _mUSDC, address admin, address insuranceFactory) {
        mUSDC = _mUSDC;

        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, insuranceFactory);

        _setRoleAdmin(POLICY_CONTRACT_ROLE, ADMIN_ROLE);
    }

    function grantRole(
        bytes32 role,
        address _newAdmin
    ) public override onlyRole(ADMIN_ROLE) {
        // to set Insurance factory as admin
        _grantRole(role, _newAdmin);
    }

    function addPolicyContract(
        address policyContract
    ) external onlyRole(ADMIN_ROLE) {
        _grantRole(POLICY_CONTRACT_ROLE, policyContract);
        policyContracts[policyContract] = true;
    }

    function receivePremium(uint256 amount) external {
        require(
            IERC20(mUSDC).transferFrom(msg.sender, address(this), amount),
            "Premium transfer failed"
        );
        emit PremiumReceived(msg.sender, amount);
    }

    function sendPayout(
        uint256 tokenId,
        address recipient,
        uint256 amount
    ) external onlyRole(POLICY_CONTRACT_ROLE) {
        require(IERC20(mUSDC).transfer(recipient, amount), "Payout failed");
        emit PayoutSent(tokenId, recipient, amount);
    }

    function deposit(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(
            IERC20(mUSDC).transferFrom(msg.sender, address(this), amount),
            "Deposit failed"
        );
    }

    function withdraw(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(
            IERC20(mUSDC).transfer(msg.sender, amount),
            "Withdrawal failed"
        );
    }

    function getBalance() external view returns (uint256) {
        return IERC20(mUSDC).balanceOf(address(this));
    }
}
