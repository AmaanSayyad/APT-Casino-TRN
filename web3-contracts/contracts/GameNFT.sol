// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GameNFT
 * @dev ERC721 token for in-game NFT rewards on TRN Network
 */
contract GameNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // NFT Rarity levels
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary }
    
    // Mapping from token ID to rarity
    mapping(uint256 => Rarity) public tokenRarity;
    
    // Game treasury address for royalties
    address public treasury;
    
    // Royalty percentage (in basis points, e.g. 250 = 2.5%)
    uint16 public royaltyBasisPoints = 250;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, Rarity rarity, string tokenURI);
    event RoyaltyPaid(address indexed from, address indexed to, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _treasury Treasury address for royalties
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _treasury
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        treasury = _treasury;
    }
    
    /**
     * @dev Mint a new NFT
     * @param to Recipient address
     * @param tokenURI Token URI
     * @param rarity Rarity level
     * @return tokenId The newly minted token ID
     */
    function mintNFT(
        address to,
        string memory tokenURI,
        Rarity rarity
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set rarity
        tokenRarity[tokenId] = rarity;
        
        // Emit event
        emit NFTMinted(to, tokenId, rarity, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Get token rarity
     * @param tokenId Token ID
     * @return Rarity level
     */
    function getRarity(uint256 tokenId) public view returns (Rarity) {
        require(_exists(tokenId), "Token does not exist");
        return tokenRarity[tokenId];
    }
    
    /**
     * @dev Set treasury address
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) public onlyOwner {
        treasury = _treasury;
    }
    
    /**
     * @dev Set royalty percentage
     * @param _basisPoints Royalty basis points (100 = 1%)
     */
    function setRoyaltyBasisPoints(uint16 _basisPoints) public onlyOwner {
        require(_basisPoints <= 1000, "Royalty cannot exceed 10%");
        royaltyBasisPoints = _basisPoints;
    }
    
    /**
     * @dev Calculate royalty amount
     * @param _salePrice Sale price
     * @return Royalty amount
     */
    function calculateRoyalty(uint256 _salePrice) public view returns (uint256) {
        return (_salePrice * royaltyBasisPoints) / 10000;
    }
    
    /**
     * @dev Pay royalty
     * @param _salePrice Sale price
     * @return Royalty amount paid
     */
    function payRoyalty(uint256 _salePrice) public payable returns (uint256) {
        uint256 royaltyAmount = calculateRoyalty(_salePrice);
        require(msg.value >= royaltyAmount, "Insufficient royalty payment");
        
        // Transfer royalty to treasury
        (bool success, ) = treasury.call{value: royaltyAmount}("");
        require(success, "Royalty transfer failed");
        
        // Refund excess payment
        if (msg.value > royaltyAmount) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - royaltyAmount}("");
            require(refundSuccess, "Refund failed");
        }
        
        // Emit event
        emit RoyaltyPaid(msg.sender, treasury, royaltyAmount);
        
        return royaltyAmount;
    }
    
    /**
     * @dev Burn token
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved to burn");
        _burn(tokenId);
    }
    
    /**
     * @dev Get total supply
     * @return Total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Check if token exists
     * @param tokenId Token ID
     * @return Whether token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
    
    /**
     * @dev TRN-specific override for multi-token gas payments
     * @param tokenAddress Address of token to use for gas
     */
    function setGasToken(address tokenAddress) public {
        // This is a placeholder for TRN's fee pallet integration
        // In a real implementation, this would interact with TRN's fee pallet
    }
} 