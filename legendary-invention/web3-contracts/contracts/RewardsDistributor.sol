// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RewardToken.sol";
import "./LiquidityPool.sol";

contract RewardsDistributor {
    RewardToken public rewardToken;
    LiquidityPool public liquidityPool;

    mapping(address => uint256) public lastClaimTime;

    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _rewardToken, address _liquidityPool) {
        rewardToken = RewardToken(_rewardToken);
        liquidityPool = LiquidityPool(_liquidityPool);
    }

    // Calculate rewards based on time staked
    function calculateRewards(address user) public view returns (uint256) {
        uint256 stakedAmount = liquidityPool.stakedAmounts(user);
        uint256 timeElapsed = block.timestamp - lastClaimTime[user];

        // Simple reward calculation: 1 token per staked token per day
        return (stakedAmount * timeElapsed) / 1 days;
    }

    // Claim rewards
    function claimRewards() external {
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");

        lastClaimTime[msg.sender] = block.timestamp;

        // Mint rewards to the user
        rewardToken.mint(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }
}
