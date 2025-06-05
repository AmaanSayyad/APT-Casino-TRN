// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameToken
 * @dev ERC20 token for in-game rewards on TRN Network
 */
contract GameToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply
    uint256 public immutable maxSupply;
    
    // Game treasury address
    address public treasury;
    
    // Addresses allowed to mint tokens
    mapping(address => bool) public minters;
    
    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _maxSupply Maximum token supply
     * @param _treasury Treasury address
     * @param _initialSupply Initial token supply to mint to treasury
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        address _treasury,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_treasury != address(0), "Treasury cannot be zero address");
        require(_initialSupply <= _maxSupply, "Initial supply exceeds max supply");
        
        maxSupply = _maxSupply;
        treasury = _treasury;
        
        // Mint initial supply to treasury
        if (_initialSupply > 0) {
            _mint(_treasury, _initialSupply);
        }
        
        // Add treasury as minter
        minters[_treasury] = true;
        emit MinterAdded(_treasury);
    }
    
    /**
     * @dev Add a minter
     * @param _minter Address to add as minter
     */
    function addMinter(address _minter) public onlyOwner {
        require(_minter != address(0), "Minter cannot be zero address");
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }
    
    /**
     * @dev Remove a minter
     * @param _minter Address to remove as minter
     */
    function removeMinter(address _minter) public onlyOwner {
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }
    
    /**
     * @dev Set treasury address
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) public onlyOwner {
        require(_treasury != address(0), "Treasury cannot be zero address");
        treasury = _treasury;
    }
    
    /**
     * @dev Mint new tokens
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public {
        // Check if sender is owner or minter
        require(owner() == msg.sender || minters[msg.sender], "Not authorized to mint");
        
        // Check max supply
        require(totalSupply() + amount <= maxSupply, "Exceeds maximum supply");
        
        // Mint tokens
        _mint(to, amount);
        
        emit TokensMinted(to, amount);
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
     * @dev Get remaining supply that can be minted
     * @return Remaining supply
     */
    function remainingSupply() public view returns (uint256) {
        return maxSupply - totalSupply();
    }
} 