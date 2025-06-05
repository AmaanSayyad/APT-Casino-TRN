import { TRN_CONFIG, GAME_REWARDS } from './config';
import { futurePassWallet } from './futurePass';

/**
 * NFT management for TRN blockchain
 * Handles minting, transfers, and metadata for in-game NFTs
 */
export class NFTManager {
  constructor() {
    this.nftCollectionAddress = TRN_CONFIG.contracts.nftCollection;
    this.gameItemsAddress = TRN_CONFIG.contracts.gameItems;
  }

  /**
   * Get user's NFT collection
   * @param {string} address User wallet address (optional, uses connected wallet if not provided)
   * @returns {Promise<Array>} Array of user's NFTs
   */
  async getUserNFTs(address = null) {
    try {
      const userAddress = address || futurePassWallet.getAddress();
      
      if (!userAddress) {
        throw new Error('No wallet address provided');
      }
      
      // Get NFTs from FuturePass
      const nfts = await futurePassWallet.getUserNFTs();
      
      // Filter NFTs from our collection
      const gameNFTs = nfts.filter(nft => 
        nft.contract.toLowerCase() === this.nftCollectionAddress.toLowerCase() ||
        nft.contract.toLowerCase() === this.gameItemsAddress.toLowerCase()
      );
      
      return gameNFTs;
    } catch (error) {
      console.error('Failed to get user NFTs:', error);
      return [];
    }
  }

  /**
   * Mint a new NFT reward for the user
   * @param {string} tokenURI Metadata URI for the NFT
   * @param {string} rarity Rarity of the NFT
   * @param {string} gasToken Token to use for gas payment
   * @returns {Promise<Object>} Minted NFT details
   */
  async mintRewardNFT(tokenURI, rarity, gasToken = 'ROOT') {
    try {
      if (!futurePassWallet.isWalletConnected()) {
        throw new Error('Wallet not connected');
      }
      
      const userAddress = futurePassWallet.getAddress();
      
      // Prepare transaction parameters
      const txParams = {
        to: this.nftCollectionAddress,
        data: this.encodeMintFunction(userAddress, tokenURI, rarity),
        value: '0',
      };
      
      // Send transaction using FuturePass
      const txHash = await futurePassWallet.sendTransaction(txParams, gasToken);
      
      // Return NFT details
      return {
        txHash,
        owner: userAddress,
        tokenURI,
        rarity,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to mint reward NFT:', error);
      throw error;
    }
  }

  /**
   * Generate a random NFT reward based on rarity
   * @returns {Promise<Object>} NFT reward details
   */
  async generateRandomNFTReward() {
    try {
      // Get a random rarity based on drop rates
      const rarity = this.getRandomRarity();
      
      // Generate metadata for the NFT
      const metadata = {
        name: `APT Casino ${rarity} Reward`,
        description: `A ${rarity} reward from APT Casino on TRN Network`,
        image: `https://api.apt-casino.trn/nft/images/${rarity.toLowerCase()}.png`,
        attributes: [
          { trait_type: 'Rarity', value: rarity },
          { trait_type: 'Game', value: 'APT Casino' },
          { trait_type: 'Timestamp', value: Date.now() },
        ],
      };
      
      // Upload metadata to IPFS or another storage solution
      // For this example, we'll assume a direct URL
      const tokenURI = `https://api.apt-casino.trn/nft/metadata/${Date.now()}`;
      
      return {
        tokenURI,
        rarity,
        metadata,
      };
    } catch (error) {
      console.error('Failed to generate random NFT reward:', error);
      throw error;
    }
  }

  /**
   * Get a random NFT rarity based on drop rates
   * @returns {string} Rarity level
   */
  getRandomRarity() {
    const { rarities, dropRates } = GAME_REWARDS.nftRewards;
    
    // Generate a random number between 0 and 100
    const random = Math.random() * 100;
    
    // Determine the rarity based on drop rates
    let cumulativeRate = 0;
    
    for (let i = 0; i < dropRates.length; i++) {
      cumulativeRate += dropRates[i];
      
      if (random <= cumulativeRate) {
        return rarities[i];
      }
    }
    
    // Default to the lowest rarity
    return rarities[0];
  }

  /**
   * Encode the mint function call for the NFT contract
   * @param {string} to Recipient address
   * @param {string} tokenURI Metadata URI for the NFT
   * @param {string} rarity Rarity of the NFT
   * @returns {string} Encoded function call
   */
  encodeMintFunction(to, tokenURI, rarity) {
    // This is a simplified example - in a real implementation,
    // you would use a library like ethers.js to encode the function call
    
    // For demonstration purposes only
    return `0x12345678${to.slice(2)}${Buffer.from(tokenURI).toString('hex')}${Buffer.from(rarity).toString('hex')}`;
  }

  /**
   * Check if an NFT can be used as a game item
   * @param {Object} nft NFT object
   * @returns {boolean} Whether the NFT can be used as a game item
   */
  isGameItem(nft) {
    return nft.contract.toLowerCase() === this.gameItemsAddress.toLowerCase();
  }

  /**
   * Get the game boost provided by an NFT
   * @param {Object} nft NFT object
   * @returns {number} Boost percentage (0-100)
   */
  getGameBoost(nft) {
    if (!this.isGameItem(nft)) {
      return 0;
    }
    
    // Extract rarity from NFT metadata
    const rarityAttribute = nft.attributes?.find(attr => attr.trait_type === 'Rarity');
    
    if (!rarityAttribute) {
      return 0;
    }
    
    // Determine boost based on rarity
    const { rarities } = GAME_REWARDS.nftRewards;
    const rarityIndex = rarities.findIndex(r => r === rarityAttribute.value);
    
    if (rarityIndex === -1) {
      return 0;
    }
    
    // Boost percentage: 5% for Common, 10% for Uncommon, etc.
    return (rarityIndex + 1) * 5;
  }
}

// Create a singleton instance
export const nftManager = new NFTManager(); 