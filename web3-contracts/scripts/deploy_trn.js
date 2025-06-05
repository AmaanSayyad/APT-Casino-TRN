// Script to deploy TRN Network contracts
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to TRN Network...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy treasury contract first
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log("Treasury deployed to:", treasury.address);
  
  // Deploy game token
  const GameToken = await hre.ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy(
    "APT Casino Game Token",            // name
    "GAME",                             // symbol
    hre.ethers.utils.parseEther("1000000000"),  // maxSupply: 1 billion
    treasury.address,                   // treasury
    hre.ethers.utils.parseEther("100000000")    // initialSupply: 100 million
  );
  await gameToken.deployed();
  console.log("GameToken deployed to:", gameToken.address);
  
  // Deploy game NFT
  const GameNFT = await hre.ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.deploy(
    "APT Casino NFT",        // name
    "APTNFT",                // symbol
    treasury.address         // treasury
  );
  await gameNFT.deployed();
  console.log("GameNFT deployed to:", gameNFT.address);
  
  // Deploy game items NFT
  const GameItemsNFT = await hre.ethers.getContractFactory("GameNFT");
  const gameItemsNFT = await GameItemsNFT.deploy(
    "APT Casino Game Items",   // name
    "APTITEM",                 // symbol
    treasury.address           // treasury
  );
  await gameItemsNFT.deployed();
  console.log("GameItemsNFT deployed to:", gameItemsNFT.address);
  
  // Set up treasury with token and NFT addresses
  await treasury.setGameToken(gameToken.address);
  await treasury.setGameNFT(gameNFT.address);
  await treasury.setGameItemsNFT(gameItemsNFT.address);
  console.log("Treasury configured with token and NFT addresses");
  
  // Add treasury as minter to game token
  await gameToken.addMinter(treasury.address);
  console.log("Treasury added as minter to GameToken");
  
  // Set up TRN multi-token gas configuration
  // These are placeholder calls - in a real deployment you would
  // use the actual TRN specific APIs
  console.log("Setting up multi-token gas configuration...");
  await gameToken.setGasToken(gameToken.address);
  await gameNFT.setGasToken(gameToken.address);
  await gameItemsNFT.setGasToken(gameToken.address);
  
  console.log("Deployment completed!");
  
  // Return the addresses for verification
  return {
    treasury: treasury.address,
    gameToken: gameToken.address,
    gameNFT: gameNFT.address,
    gameItemsNFT: gameItemsNFT.address,
  };
}

// Execute the deployment
main()
  .then((addresses) => {
    console.log("Deployed contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 