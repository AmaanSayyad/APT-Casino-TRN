// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for interacting with the Euclid Protocol liquidity pool
interface EuclidPool {
    function stake(uint256 amount) external returns (bool);
    function withdraw(uint256 amount) external returns (bool);
    function getExchangeRate() external view returns (uint256);
}

contract LiquidityPool {
    address public owner;
    EuclidPool public euclidPool;
    mapping(address => uint256) public stakedAmounts;

    // Events for logging staking and withdrawal
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // Constructor initializes the Euclid Pool with the selected VLP address
    constructor(address _euclidPoolAddress) {
        euclidPool = EuclidPool(_euclidPoolAddress);
        owner = msg.sender;
    }

    // Function to stake Euclid tokens into the liquidity pool
    function stakeEuclidTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        bool success = euclidPool.stake(amount);
        require(success, "Staking failed");

        stakedAmounts[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    // Function to withdraw Nibiru tokens from the liquidity pool
    function withdrawNibiruTokens(uint256 amount) external {
        require(stakedAmounts[msg.sender] >= amount, "Insufficient balance");

        bool success = euclidPool.withdraw(amount);
        require(success, "Withdrawal failed");

        stakedAmounts[msg.sender] -= amount;
        emit Withdrawn(msg.sender, amount);
    }

    // Function to get the current liquidity details
    function getLiquidityDetails() external view returns (uint256 totalLiquidity, uint256 exchangeRate) {
        return (address(this).balance, euclidPool.getExchangeRate());
    }
}
