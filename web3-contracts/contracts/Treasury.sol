// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./GameToken.sol";
import "./GameNFT.sol";

/**
 * @title Treasury
 * @dev Treasury contract for managing game tokens and NFTs
 */
contract Treasury is Ownable {
    // Game token
    GameToken public gameToken;
    
    // Game NFT
    GameNFT public gameNFT;
    
    // Game items NFT
    GameNFT public gameItemsNFT;
    
    // Reward distributor addresses
    mapping(address => bool) public rewardDistributors;
    
    // Events
    event RewardDistributorAdded(address indexed distributor);
    event RewardDistributorRemoved(address indexed distributor);
    event TokenRewardSent(address indexed to, uint256 amount);
    event NFTRewardSent(address indexed to, uint256 tokenId);
    
    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Set game token address
     * @param _gameToken Game token address
     */
    function setGameToken(address _gameToken) public onlyOwner {
        require(_gameToken != address(0), "Game token cannot be zero address");
        gameToken = GameToken(_gameToken);
    }
    
    /**
     * @dev Set game NFT address
     * @param _gameNFT Game NFT address
     */
    function setGameNFT(address _gameNFT) public onlyOwner {
        require(_gameNFT != address(0), "Game NFT cannot be zero address");
        gameNFT = GameNFT(_gameNFT);
    }
    
    /**
     * @dev Set game items NFT address
     * @param _gameItemsNFT Game items NFT address
     */
    function setGameItemsNFT(address _gameItemsNFT) public onlyOwner {
        require(_gameItemsNFT != address(0), "Game items NFT cannot be zero address");
        gameItemsNFT = GameNFT(_gameItemsNFT);
    }
    
    /**
     * @dev Add reward distributor
     * @param distributor Distributor address
     */
    function addRewardDistributor(address distributor) public onlyOwner {
        require(distributor != address(0), "Distributor cannot be zero address");
        rewardDistributors[distributor] = true;
        emit RewardDistributorAdded(distributor);
    }
    
    /**
     * @dev Remove reward distributor
     * @param distributor Distributor address
     */
    function removeRewardDistributor(address distributor) public onlyOwner {
        rewardDistributors[distributor] = false;
        emit RewardDistributorRemoved(distributor);
    }
    
    /**
     * @dev Send token reward
     * @param to Recipient address
     * @param amount Amount to send
     */
    function sendTokenReward(address to, uint256 amount) public {
        require(owner() == msg.sender || rewardDistributors[msg.sender], "Not authorized");
        require(to != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens
        require(gameToken.transfer(to, amount), "Token transfer failed");
        
        emit TokenRewardSent(to, amount);
    }
    
    /**
     * @dev Mint token reward
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mintTokenReward(address to, uint256 amount) public {
        require(owner() == msg.sender || rewardDistributors[msg.sender], "Not authorized");
        require(to != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Mint tokens
        gameToken.mint(to, amount);
        
        emit TokenRewardSent(to, amount);
    }
    
    /**
     * @dev Mint NFT reward
     * @param to Recipient address
     * @param tokenURI Token URI
     * @param rarity Rarity level (0: Common, 1: Uncommon, 2: Rare, 3: Epic, 4: Legendary)
     * @return tokenId Minted token ID
     */
    function mintNFTReward(
        address to,
        string memory tokenURI,
        uint8 rarity
    ) public returns (uint256) {
        require(owner() == msg.sender || rewardDistributors[msg.sender], "Not authorized");
        require(to != address(0), "Recipient cannot be zero address");
        
        // Mint NFT
        uint256 tokenId = gameNFT.mintNFT(to, tokenURI, GameNFT.Rarity(rarity));
        
        emit NFTRewardSent(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Mint game item NFT
     * @param to Recipient address
     * @param tokenURI Token URI
     * @param rarity Rarity level (0: Common, 1: Uncommon, 2: Rare, 3: Epic, 4: Legendary)
     * @return tokenId Minted token ID
     */
    function mintGameItemNFT(
        address to,
        string memory tokenURI,
        uint8 rarity
    ) public returns (uint256) {
        require(owner() == msg.sender || rewardDistributors[msg.sender], "Not authorized");
        require(to != address(0), "Recipient cannot be zero address");
        
        // Mint NFT
        uint256 tokenId = gameItemsNFT.mintNFT(to, tokenURI, GameNFT.Rarity(rarity));
        
        emit NFTRewardSent(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev TRN-specific override for multi-token gas payments
     * @param tokenAddress Address of token to use for gas
     */
    function setGasToken(address tokenAddress) public {
        // This is a placeholder for TRN's fee pallet integration
        // In a real implementation, this would interact with TRN's fee pallet
    }
    
    /**
     * @dev Withdraw tokens
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawTokens(address token, address to, uint256 amount) public onlyOwner {
        require(token != address(0), "Token cannot be zero address");
        require(to != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens
        IERC20(token).transfer(to, amount);
    }
    
    /**
     * @dev Withdraw native tokens
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawNative(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");
        
        // Transfer native tokens
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Receive function to accept native tokens
     */
    receive() external payable {}
} 