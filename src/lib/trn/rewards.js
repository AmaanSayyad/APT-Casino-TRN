"use client";

import { TRN_CONFIG, GAME_REWARDS } from './config';
import { futurePassWallet } from './futurePass';
import { nftManager } from './nft';

/**
 * Game rewards system for TRN blockchain
 * Handles token rewards, achievements, and NFT drops
 */
export class RewardsSystem {
  constructor() {
    this.userStats = {};
    this.achievementsEarned = {};
  }

  /**
   * Initialize user rewards data
   * @param {string} userAddress User wallet address
   * @returns {Promise<Object>} User rewards data
   */
  async initializeUserRewards(userAddress) {
    try {
      if (!userAddress) {
        throw new Error('No wallet address provided');
      }
      
      // Check if user already has stats
      if (this.userStats[userAddress]) {
        return this.userStats[userAddress];
      }
      
      // Initialize user stats
      this.userStats[userAddress] = {
        totalWins: 0,
        totalLosses: 0,
        totalPlayed: 0,
        winStreak: 0,
        highestWin: '0',
        lastDailyReward: 0,
        totalRewards: '0',
        achievements: [],
      };
      
      // Initialize achievements
      this.achievementsEarned[userAddress] = new Set();
      
      return this.userStats[userAddress];
    } catch (error) {
      console.error('Failed to initialize user rewards:', error);
      throw error;
    }
  }

  /**
   * Update user stats after a game
   * @param {string} userAddress User wallet address
   * @param {boolean} isWin Whether the game was won
   * @param {string} betAmount Amount bet
   * @param {string} winAmount Amount won (0 if lost)
   * @returns {Promise<Object>} Updated user stats
   */
  async updateGameStats(userAddress, isWin, betAmount, winAmount) {
    try {
      // Initialize user rewards if not already done
      if (!this.userStats[userAddress]) {
        await this.initializeUserRewards(userAddress);
      }
      
      const stats = this.userStats[userAddress];
      
      // Update basic stats
      stats.totalPlayed += 1;
      
      if (isWin) {
        stats.totalWins += 1;
        stats.winStreak += 1;
        
        // Update highest win if applicable
        if (parseFloat(winAmount) > parseFloat(stats.highestWin)) {
          stats.highestWin = winAmount;
        }
      } else {
        stats.totalLosses += 1;
        stats.winStreak = 0;
      }
      
      // Check for achievements
      await this.checkAchievements(userAddress);
      
      return stats;
    } catch (error) {
      console.error('Failed to update game stats:', error);
      throw error;
    }
  }

  /**
   * Check and award achievements
   * @param {string} userAddress User wallet address
   * @returns {Promise<Array>} Newly earned achievements
   */
  async checkAchievements(userAddress) {
    try {
      const stats = this.userStats[userAddress];
      const earnedAchievements = this.achievementsEarned[userAddress];
      const newAchievements = [];
      
      // Check for first win achievement
      if (stats.totalWins === 1 && !earnedAchievements.has('first_win')) {
        const achievement = GAME_REWARDS.achievements.find(a => a.id === 'first_win');
        
        if (achievement) {
          await this.awardAchievement(userAddress, achievement);
          earnedAchievements.add('first_win');
          newAchievements.push(achievement);
        }
      }
      
      // Check for winning streak achievement
      if (stats.winStreak >= 5 && !earnedAchievements.has('winning_streak')) {
        const achievement = GAME_REWARDS.achievements.find(a => a.id === 'winning_streak');
        
        if (achievement) {
          await this.awardAchievement(userAddress, achievement);
          earnedAchievements.add('winning_streak');
          newAchievements.push(achievement);
        }
      }
      
      // Check for high roller achievement
      if (parseFloat(stats.highestWin) >= 100 && !earnedAchievements.has('high_roller')) {
        const achievement = GAME_REWARDS.achievements.find(a => a.id === 'high_roller');
        
        if (achievement) {
          await this.awardAchievement(userAddress, achievement);
          earnedAchievements.add('high_roller');
          newAchievements.push(achievement);
        }
      }
      
      // Check for jackpot achievement
      if (parseFloat(stats.highestWin) >= 1000 && !earnedAchievements.has('jackpot')) {
        const achievement = GAME_REWARDS.achievements.find(a => a.id === 'jackpot');
        
        if (achievement) {
          await this.awardAchievement(userAddress, achievement);
          earnedAchievements.add('jackpot');
          newAchievements.push(achievement);
        }
      }
      
      return newAchievements;
    } catch (error) {
      console.error('Failed to check achievements:', error);
      return [];
    }
  }

  /**
   * Award an achievement to the user
   * @param {string} userAddress User wallet address
   * @param {Object} achievement Achievement to award
   * @returns {Promise<boolean>} Success status
   */
  async awardAchievement(userAddress, achievement) {
    try {
      // Add achievement to user stats
      this.userStats[userAddress].achievements.push({
        id: achievement.id,
        name: achievement.name,
        awardedAt: Date.now(),
      });
      
      // Award the reward
      if (achievement.type === 'GAME') {
        // Award token reward
        await this.awardTokens(userAddress, achievement.reward);
      } else if (achievement.type === 'NFT') {
        // Award NFT reward
        await this.awardNFT(userAddress);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to award achievement:', error);
      return false;
    }
  }

  /**
   * Award tokens to the user
   * @param {string} userAddress User wallet address
   * @param {string} amount Amount of tokens to award
   * @returns {Promise<string>} Transaction hash
   */
  async awardTokens(userAddress, amount) {
    try {
      if (!futurePassWallet.isWalletConnected()) {
        throw new Error('Wallet not connected');
      }
      
      // Prepare transaction parameters for token transfer
      const gameTokenAddress = TRN_CONFIG.feePallet.supportedTokens.find(
        token => token.symbol === 'GAME'
      )?.address;
      
      if (!gameTokenAddress) {
        throw new Error('GAME token address not found');
      }
      
      // Create token transfer transaction
      const txParams = {
        to: gameTokenAddress,
        data: this.encodeTokenTransferFunction(userAddress, amount),
        value: '0',
      };
      
      // Send transaction using XRP token for gas
      const txHash = await futurePassWallet.sendTransaction(txParams, 'XRP');
      
      // Update user's total rewards
      this.userStats[userAddress].totalRewards = (
        parseFloat(this.userStats[userAddress].totalRewards) + 
        parseFloat(amount)
      ).toString();
      
      return txHash;
    } catch (error) {
      console.error('Failed to award tokens:', error);
      throw error;
    }
  }

  /**
   * Award an NFT to the user
   * @param {string} userAddress User wallet address
   * @returns {Promise<Object>} NFT details
   */
  async awardNFT(userAddress) {
    try {
      // Generate a random NFT reward
      const { tokenURI, rarity } = await nftManager.generateRandomNFTReward();
      
      // Mint the NFT for the user
      const nftDetails = await nftManager.mintRewardNFT(tokenURI, rarity, 'XRP');
      
      return nftDetails;
    } catch (error) {
      console.error('Failed to award NFT:', error);
      throw error;
    }
  }

  /**
   * Check for and award daily login reward
   * @param {string} userAddress User wallet address
   * @returns {Promise<Object|null>} Reward details or null if already claimed
   */
  async checkDailyReward(userAddress) {
    try {
      // Initialize user rewards if not already done
      if (!this.userStats[userAddress]) {
        await this.initializeUserRewards(userAddress);
      }
      
      const stats = this.userStats[userAddress];
      const now = Date.now();
      
      // Check if reward already claimed today
      // 86400000 ms = 24 hours
      if (stats.lastDailyReward > 0 && 
          now - stats.lastDailyReward < 86400000) {
        return null;
      }
      
      // Award the daily login bonus
      const amount = GAME_REWARDS.dailyRewards.loginBonus;
      const txHash = await this.awardTokens(userAddress, amount);
      
      // Update last reward time
      stats.lastDailyReward = now;
      
      return {
        type: 'daily',
        amount,
        txHash,
        timestamp: now,
      };
    } catch (error) {
      console.error('Failed to check daily reward:', error);
      return null;
    }
  }

  /**
   * Award tokens for completed games
   * @param {string} userAddress User wallet address
   * @returns {Promise<Object|null>} Reward details or null if max reached
   */
  async awardGameCompletionReward(userAddress) {
    try {
      // Check daily reward limit
      const dailyRewards = await this.getTodayRewards(userAddress);
      
      if (parseFloat(dailyRewards) >= parseFloat(GAME_REWARDS.dailyRewards.maxDailyReward)) {
        return null;
      }
      
      // Award the game completion bonus
      const amount = GAME_REWARDS.dailyRewards.completedGames;
      const txHash = await this.awardTokens(userAddress, amount);
      
      return {
        type: 'gameCompletion',
        amount,
        txHash,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to award game completion reward:', error);
      return null;
    }
  }

  /**
   * Get total rewards earned today
   * @param {string} userAddress User wallet address
   * @returns {Promise<string>} Total rewards earned today
   */
  async getTodayRewards(userAddress) {
    try {
      // Initialize user rewards if not already done
      if (!this.userStats[userAddress]) {
        await this.initializeUserRewards(userAddress);
      }
      
      // TODO: In a real implementation, this would query the blockchain
      // or a database for the actual rewards earned today
      
      // For this example, we'll assume a fixed amount based on total played today
      const stats = this.userStats[userAddress];
      const todayPlayed = Math.min(stats.totalPlayed, 20); // Cap at 20 games
      
      return (todayPlayed * parseFloat(GAME_REWARDS.dailyRewards.completedGames)).toString();
    } catch (error) {
      console.error('Failed to get today rewards:', error);
      return '0';
    }
  }

  /**
   * Encode the token transfer function call
   * @param {string} to Recipient address
   * @param {string} amount Amount of tokens to transfer
   * @returns {string} Encoded function call
   */
  encodeTokenTransferFunction(to, amount) {
    // This is a simplified example - in a real implementation,
    // you would use a library like ethers.js to encode the function call
    
    // For demonstration purposes only
    const amountInWei = parseFloat(amount) * 10**18;
    return `0xa9059cbb${to.slice(2)}${amountInWei.toString(16).padStart(64, '0')}`;
  }
}

// Create a singleton instance
export const rewardsSystem = new RewardsSystem(); 