"use client";

import { useState, useEffect, useCallback } from 'react';
import { TRN_CONFIG } from '@/lib/trn/config';
import { futurePassWallet, setupFuturePassEvents } from '@/lib/trn/futurePass';
import { nftManager } from '@/lib/trn/nft';
import { rewardsSystem } from '@/lib/trn/rewards';

/**
 * Custom hook for TRN blockchain integration
 * Provides wallet connection, NFT management, and rewards functionality
 */
export function useTRN() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [balances, setBalances] = useState({});
  const [nfts, setNfts] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initialize TRN integration
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize FuturePass events
        setupFuturePassEvents();
        
        // Check if wallet is already connected
        if (futurePassWallet.isWalletConnected()) {
          setIsConnected(true);
          setWalletAddress(futurePassWallet.getAddress());
          
          // Load user data
          await loadUserData();
        }
      } catch (err) {
        console.error('Failed to initialize TRN:', err);
        setError('Failed to initialize TRN integration');
      }
    };
    
    initialize();
  }, []);

  /**
   * Load user data (balances, NFTs, stats)
   */
  const loadUserData = useCallback(async () => {
    if (!futurePassWallet.isWalletConnected()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const address = futurePassWallet.getAddress();
      
      // Get user balances
      const userBalances = await futurePassWallet.getUserBalances();
      setBalances(userBalances);
      
      // Get user NFTs
      const userNfts = await nftManager.getUserNFTs(address);
      setNfts(userNfts);
      
      // Get user stats
      const stats = await rewardsSystem.initializeUserRewards(address);
      setUserStats(stats);
      
      // Check for daily reward
      await rewardsSystem.checkDailyReward(address);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data');
      setLoading(false);
    }
  }, []);

  /**
   * Connect wallet
   */
  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const address = await futurePassWallet.connect();
      
      if (address) {
        setIsConnected(true);
        setWalletAddress(address);
        setUserInfo(futurePassWallet.userInfo);
        
        // Load user data
        await loadUserData();
      } else {
        setError('Failed to connect wallet');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet: ' + err.message);
      setLoading(false);
    }
  }, [loadUserData]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(async () => {
    try {
      await futurePassWallet.disconnect();
      
      setIsConnected(false);
      setWalletAddress(null);
      setUserInfo(null);
      setBalances({});
      setNfts([]);
      setUserStats(null);
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError('Failed to disconnect wallet');
    }
  }, []);

  /**
   * Update game stats after a game
   */
  const updateGameStats = useCallback(async (isWin, betAmount, winAmount) => {
    if (!isConnected || !walletAddress) {
      return null;
    }
    
    try {
      // Update game stats
      const stats = await rewardsSystem.updateGameStats(
        walletAddress,
        isWin,
        betAmount,
        winAmount
      );
      
      // Award game completion reward
      await rewardsSystem.awardGameCompletionReward(walletAddress);
      
      // Reload user data
      await loadUserData();
      
      return stats;
    } catch (err) {
      console.error('Failed to update game stats:', err);
      setError('Failed to update game stats');
      return null;
    }
  }, [isConnected, walletAddress, loadUserData]);

  /**
   * Get gas token options
   */
  const getGasTokenOptions = useCallback(() => {
    return TRN_CONFIG.feePallet.supportedTokens.map(token => ({
      value: token.symbol,
      label: token.symbol,
      address: token.address,
      logo: token.logo,
      decimals: token.decimals,
    }));
  }, []);

  /**
   * Send a transaction with a specific gas token
   */
  const sendTransaction = useCallback(async (txParams, gasToken = 'ROOT') => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const txHash = await futurePassWallet.sendTransaction(txParams, gasToken);
      return txHash;
    } catch (err) {
      console.error('Failed to send transaction:', err);
      setError('Failed to send transaction: ' + err.message);
      throw err;
    }
  }, [isConnected]);

  /**
   * Get user's NFT boost for games
   */
  const getNFTBoost = useCallback(() => {
    if (!nfts || nfts.length === 0) {
      return 0;
    }
    
    // Find the NFT with the highest boost
    let maxBoost = 0;
    
    for (const nft of nfts) {
      const boost = nftManager.getGameBoost(nft);
      maxBoost = Math.max(maxBoost, boost);
    }
    
    return maxBoost;
  }, [nfts]);

  return {
    isConnected,
    walletAddress,
    userInfo,
    balances,
    nfts,
    userStats,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    loadUserData,
    updateGameStats,
    getGasTokenOptions,
    sendTransaction,
    getNFTBoost,
  };
} 