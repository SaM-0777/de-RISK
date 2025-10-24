// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MUSDC is ERC20, Ownable {
  constructor() ERC20("mUSDC", "mUSDC") Ownable(msg.sender) {
    _mint(msg.sender, 1_000_000 * 10**18); // Mint 1M tokens to deployer
  }

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }
}
