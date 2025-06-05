"use client";

import { useState, useEffect } from 'react';
import { useTRN } from '@/hooks/useTRN';
import { formatAddress } from '@/utils/formatters';
import { TRN_CONFIG } from '@/lib/trn/config';

const FuturePassWallet = () => {
  const {
    isConnected,
    walletAddress,
    balances,
    nfts,
    userStats,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getGasTokenOptions,
  } = useTRN();

  const [gasToken, setGasToken] = useState('ROOT');
  const [showTokens, setShowTokens] = useState(false);
  const [showNFTs, setShowNFTs] = useState(false);

  // Token balance display
  const TokenBalance = ({ token }) => {
    const tokenBalance = balances?.[token.address] || '0';
    const formattedBalance = parseFloat(tokenBalance) / 10 ** token.decimals;
    
    return (
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800 mb-2">
        <div className="flex items-center">
          <img src={token.logo} alt={token.symbol} className="w-6 h-6 mr-2" />
          <span>{token.symbol}</span>
        </div>
        <span>{formattedBalance.toFixed(4)}</span>
      </div>
    );
  };

  // NFT display
  const NFTDisplay = ({ nft }) => {
    return (
      <div className="p-2 rounded-lg bg-gray-800 mb-2">
        <div className="text-sm mb-1">{nft.name || 'Game NFT'}</div>
        {nft.image && (
          <img 
            src={nft.image} 
            alt={nft.name || 'Game NFT'} 
            className="w-full h-24 object-cover rounded-md mb-1"
          />
        )}
        <div className="text-xs text-gray-400">
          {nft.attributes?.map((attr, index) => (
            <span key={index} className="mr-2">
              {attr.trait_type}: {attr.value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Gas token selector
  const GasTokenSelector = () => {
    const options = getGasTokenOptions();
    
    return (
      <div className="mt-3">
        <label className="text-sm text-gray-300 mb-1 block">
          Pay gas fees with:
        </label>
        <div className="relative">
          <select
            value={gasToken}
            onChange={(e) => setGasToken(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Stats display
  const StatsDisplay = () => {
    if (!userStats) return null;
    
    return (
      <div className="mt-3 p-3 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Game Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Games Played: {userStats.totalPlayed}</div>
          <div>Total Wins: {userStats.totalWins}</div>
          <div>Win Streak: {userStats.winStreak}</div>
          <div>Highest Win: {userStats.highestWin}</div>
          <div>Total Rewards: {userStats.totalRewards} GAME</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl p-4 shadow-lg w-full max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">FuturePass</h2>
        {isConnected && (
          <button
            onClick={disconnectWallet}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Disconnect
          </button>
        )}
      </div>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect FuturePass Wallet'}
        </button>
      ) : (
        <div>
          <div className="mb-3 p-3 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-400">Connected Wallet</div>
            <div className="font-medium">{formatAddress(walletAddress)}</div>
          </div>

          <div className="mb-3">
            <button
              onClick={() => setShowTokens(!showTokens)}
              className="flex justify-between items-center w-full p-3 bg-gray-800 rounded-lg"
            >
              <span className="font-medium">Tokens</span>
              <span>{showTokens ? '▲' : '▼'}</span>
            </button>
            
            {showTokens && (
              <div className="mt-2">
                {TRN_CONFIG.feePallet.supportedTokens.map((token) => (
                  <TokenBalance key={token.symbol} token={token} />
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <button
              onClick={() => setShowNFTs(!showNFTs)}
              className="flex justify-between items-center w-full p-3 bg-gray-800 rounded-lg"
            >
              <span className="font-medium">Game NFTs ({nfts.length})</span>
              <span>{showNFTs ? '▲' : '▼'}</span>
            </button>
            
            {showNFTs && (
              <div className="mt-2">
                {nfts.length === 0 ? (
                  <div className="text-sm text-gray-400 p-2">
                    No game NFTs found. Win games to earn NFTs!
                  </div>
                ) : (
                  nfts.map((nft, index) => (
                    <NFTDisplay key={index} nft={nft} />
                  ))
                )}
              </div>
            )}
          </div>

          <GasTokenSelector />
          <StatsDisplay />
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default FuturePassWallet; 