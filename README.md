# APT Casino on TRN Network

This project is an implementation of APT Casino on TRN Network for the TRN Game Forge track.

## TRN Integration Features

This casino application leverages the following TRN Network features:

### 1. Fee Pallets (Multi-Token Gas Economy)

- Pay transaction fees with different tokens (ROOT or GAME tokens)
- Users can select which token to use for gas fees
- Seamless transaction experience with any supported token

### 2. NFT & Collectibles Pallets

- In-game NFT rewards for achievements and wins
- Different rarity levels of NFTs with special properties
- NFT items that provide in-game boosts and advantages
- On-chain ownership of game assets

### 3. FuturePass Wallet Integration

- Seamless wallet connection using FuturePass
- User-friendly login and transaction flow
- Secure and simplified gaming experience
- View and manage game assets directly in the app

### 4. Game Rewards System

- Earn GAME tokens for playing and winning
- Daily rewards for active players
- Achievement system with token and NFT rewards
- On-chain reward mechanics and incentives

## Smart Contracts

The project includes the following TRN-compatible smart contracts:

1. **GameToken.sol**: ERC20 token for in-game rewards
2. **GameNFT.sol**: ERC721 token for in-game NFT rewards
3. **Treasury.sol**: Manages game tokens and NFTs

These contracts support TRN's multi-token gas economy through the `setGasToken` function.

## Architecture

The application is built with the following architecture:

1. **Frontend**: Next.js application with React components
2. **Blockchain Integration**: TRN Network integration with FuturePass wallet
3. **Smart Contracts**: Solidity contracts deployed on TRN Network
4. **Game Logic**: Casino games with token rewards and NFT drops

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn or npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/apt-casino-trn.git
   cd apt-casino-trn
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

To deploy the application and smart contracts to TRN Network:

1. Update the TRN configuration in `src/lib/trn/config.js` with actual values
2. Deploy the smart contracts using the deployment script
   ```
   cd web3-contracts
   npx hardhat run scripts/deploy_trn.js --network trn
   ```
3. Update the contract addresses in the configuration file
4. Build and deploy the frontend application

## License

This project is licensed under the MIT License. 
