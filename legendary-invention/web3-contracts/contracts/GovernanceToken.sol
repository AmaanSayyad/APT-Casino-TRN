// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {
    constructor() ERC20("Governance Token", "GOVT") {
        _mint(msg.sender, 500000 * 10**18); // Mint 500,000 tokens to the deployer
    }

    // Function to delegate tokens for voting
    function delegate(address to, uint256 amount) external {
        transfer(to, amount); // Simple delegation logic
    }
}
