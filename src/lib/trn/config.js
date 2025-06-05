// TRN Network Configuration
export const TRN_CONFIG = {
  // Network details
  chainId: '0x1DF8', // 7672 in hex
  chainName: 'ROOT Porcini Testnet',
  rpcUrl: 'https://porcini.rootnet.app/archive', // Updated RPC URL
  
  // Native token details
  nativeCurrency: {
    name: 'XRP',
    symbol: 'XRP',
    decimals: 18,
  },
  
  // FuturePass configuration
  futurePass: {
    apiUrl: 'https://api.futurepass.trn.network', // Replace with actual API URL
    appId: 'apt-casino-trn', // Replace with your app ID
  },
  
  // Contract addresses
  contracts: {
    nftCollection: '0x...', // Replace with actual NFT collection address
    gameItems: '0x...', // Replace with actual game items address
    treasury: '0x...', // Replace with actual treasury address
  },
  
  // Fee pallet configuration for multi-token gas payments
  feePallet: {
    supportedTokens: [
      { 
        symbol: 'XRP', 
        address: '0x0000000000000000000000000000000000000000', // Native token
        decimals: 18,
        logo: '/rootscan-logo.png',
      },
      {
        symbol: 'GAME',
        address: '0x...', // Replace with actual game token address
        decimals: 18,
        logo: '/GAME ROOT.png',
      },
      // Add more supported tokens as needed
    ],
  },
  
  // Explorer URL
  explorer: {
    url: 'https://porcini.rootscan.io',
    name: 'Rootscan Explorer',
  },
}

// Game Reward Configuration
export const GAME_REWARDS = {
  // Daily rewards for active players
  dailyRewards: {
    loginBonus: '1', // 1 GAME token
    completedGames: '0.5', // 0.5 GAME tokens per completed game
    maxDailyReward: '10', // Maximum 10 GAME tokens per day
  },
  
  // Achievement rewards
  achievements: [
    { id: 'first_win', name: 'First Win', reward: '5', type: 'GAME' },
    { id: 'winning_streak', name: 'Winning Streak', reward: '10', type: 'GAME' },
    { id: 'high_roller', name: 'High Roller', reward: '20', type: 'GAME' },
    { id: 'jackpot', name: 'Jackpot', reward: '1', type: 'NFT' },
  ],
  
  // NFT rewards
  nftRewards: {
    rarities: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    dropRates: [70, 20, 7, 2, 1], // Percentage chances
  },
}

// Sequence SDK Configuration for Unity/Unreal integration
export const SEQUENCE_SDK_CONFIG = {
  projectId: 'apt-casino-trn', // Replace with your project ID
  baseUrl: 'https://sequence.trn.network', // Replace with actual Sequence SDK URL
  gameEngines: ['Unity', 'Unreal'],
} 