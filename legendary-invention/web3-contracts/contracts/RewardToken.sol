// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RWT") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1,000,000 tokens to the deployer
    }

    // Function to mint more tokens for rewards
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
