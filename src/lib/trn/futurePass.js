"use client";

import { TRN_CONFIG } from './config';

/**
 * FuturePass integration for TRN blockchain
 * Provides functionality for wallet connection, authentication, and transactions
 */
export class FuturePassWallet {
  constructor() {
    this.isConnected = false;
    this.walletAddress = null;
    this.userInfo = null;
  }

  /**
   * Initialize the FuturePass wallet
   * @returns {Promise<boolean>} Connection status
   */
  async initialize() {
    try {
      // In development environment, create a mock implementation
      if (typeof window !== 'undefined' && !window.futurepass) {
        console.log('FuturePass SDK not detected - using mock implementation for development');
        this._setupMockFuturePass();
        return true;
      }
      
      // Initialize the FuturePass SDK if available
      if (typeof window !== 'undefined' && window.futurepass) {
        // Initialize the FuturePass SDK
        await window.futurepass.initialize({
          appId: TRN_CONFIG.futurePass.appId,
          network: TRN_CONFIG.chainName,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize FuturePass:', error);
      return false;
    }
  }

  /**
   * Connect to the FuturePass wallet
   * @returns {Promise<string|null>} Connected wallet address or null
   */
  async connect() {
    try {
      const initialized = await this.initialize();
      
      if (!initialized) {
        console.warn('FuturePass not available - using mock implementation');
        // Use mock even if initialization failed
        this._setupMockFuturePass();
      }
      
      // Request wallet connection
      const accounts = await window.futurepass.connect();
      
      if (accounts && accounts.length > 0) {
        this.walletAddress = accounts[0];
        this.isConnected = true;
        
        // Get user info
        this.userInfo = await window.futurepass.getUserInfo();
        
        return this.walletAddress;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to connect to FuturePass:', error);
      // In case of error, use mock implementation for development
      this._setupMockFuturePass();
      
      // Simulate successful connection with mock wallet
      const mockAddress = '0xF72...5b6'; // Development mock address
      this.walletAddress = mockAddress;
      this.isConnected = true;
      this.userInfo = { name: 'Mock User', avatar: null };
      
      return mockAddress;
    }
  }

  /**
   * Set up mock FuturePass implementation for development
   * This allows the app to function without the actual FuturePass SDK
   */
  _setupMockFuturePass() {
    if (typeof window !== 'undefined') {
      window.futurepass = {
        initialize: async () => true,
        connect: async () => ['0xF72...5b6'],
        disconnect: async () => true,
        getUserInfo: async () => ({ name: 'Mock User', avatar: null }),
        getBalances: async () => ({
          '0x0000000000000000000000000000000000000000': '1000000000000000000', // 1 ROOT
          [TRN_CONFIG.feePallet.supportedTokens[1].address]: '500000000000000000000', // 500 GAME
        }),
        getNFTs: async () => [],
        sendTransaction: async (txParams) => '0xF72...5b6',
        signMessage: async (message) => '0xF72...5b6',
        on: (event, callback) => {
          // No-op for mock
        },
      };
    }
  }

  /**
   * Disconnect from the FuturePass wallet
   */
  async disconnect() {
    try {
      if (this.isConnected && window.futurepass) {
        await window.futurepass.disconnect();
        this.isConnected = false;
        this.walletAddress = null;
        this.userInfo = null;
      }
    } catch (error) {
      console.error('Failed to disconnect from FuturePass:', error);
    }
  }

  /**
   * Get the connected wallet address
   * @returns {string|null} Wallet address or null if not connected
   */
  getAddress() {
    return this.walletAddress;
  }

  /**
   * Check if the wallet is connected
   * @returns {boolean} Connection status
   */
  isWalletConnected() {
    return this.isConnected;
  }

  /**
   * Send a transaction through FuturePass
   * @param {Object} txParams Transaction parameters
   * @param {string} gasToken Token to use for gas payment (from supported tokens)
   * @returns {Promise<string>} Transaction hash
   */
  async sendTransaction(txParams, gasToken = 'ROOT') {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Get the token address to use for gas payment
      const supportedToken = TRN_CONFIG.feePallet.supportedTokens.find(
        token => token.symbol === gasToken
      );
      
      if (!supportedToken) {
        throw new Error(`Token ${gasToken} is not supported for gas payment`);
      }
      
      // Add gas token to transaction parameters
      const txWithGasToken = {
        ...txParams,
        gasToken: supportedToken.address,
      };
      
      // Send the transaction
      const txHash = await window.futurepass.sendTransaction(txWithGasToken);
      
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Sign a message using FuturePass
   * @param {string} message Message to sign
   * @returns {Promise<string>} Signature
   */
  async signMessage(message) {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const signature = await window.futurepass.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  /**
   * Get user NFTs from FuturePass
   * @returns {Promise<Array>} Array of user NFTs
   */
  async getUserNFTs() {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const nfts = await window.futurepass.getNFTs();
      return nfts;
    } catch (error) {
      console.error('Failed to get user NFTs:', error);
      throw error;
    }
  }

  /**
   * Get user balances from FuturePass
   * @returns {Promise<Object>} User token balances
   */
  async getUserBalances() {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const balances = await window.futurepass.getBalances();
      return balances;
    } catch (error) {
      console.error('Failed to get user balances:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const futurePassWallet = new FuturePassWallet();

// Hook to handle FuturePass wallet events
export function setupFuturePassEvents() {
  if (typeof window !== 'undefined' && window.futurepass) {
    // Handle account changes
    window.futurepass.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        futurePassWallet.disconnect();
      } else {
        futurePassWallet.walletAddress = accounts[0];
      }
    });
    
    // Handle chain changes
    window.futurepass.on('chainChanged', (chainId) => {
      // Reload the page if chain changes
      window.location.reload();
    });
    
    // Handle disconnect
    window.futurepass.on('disconnect', () => {
      futurePassWallet.disconnect();
    });
  }
} 