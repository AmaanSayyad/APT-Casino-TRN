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

  const [gasToken, setGasToken] = useState('XRP');
  const [showTokens, setShowTokens] = useState(false);
  const [showNFTs, setShowNFTs] = useState(false);

  // Token balance display
  const TokenBalance = ({ token }) => {
    const tokenBalance = balances?.[token.address] || '0';
    const formattedBalance = parseFloat(tokenBalance) / 10 ** token.decimals;
    
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#250020] hover:bg-[#2a0025] transition-colors mb-2 border border-purple-900/20">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-black/20 p-1 mr-3 flex items-center justify-center">
            <img src={token.logo} alt={token.symbol} className="w-full h-full object-contain" />
          </div>
          <span className="font-medium">{token.symbol}</span>
        </div>
        <span className="font-mono text-right bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text font-semibold">
          {formattedBalance.toFixed(4)}
        </span>
      </div>
    );
  };

  // NFT display
  const NFTDisplay = ({ nft }) => {
    return (
      <div className="p-3 rounded-lg bg-[#250020] hover:bg-[#2a0025] transition-colors mb-2 border border-purple-900/20">
        <div className="font-medium mb-2">{nft.name || 'Game NFT'}</div>
        {nft.image && (
          <div className="relative overflow-hidden rounded-lg mb-2 border border-purple-900/30">
            <img 
              src={nft.image} 
              alt={nft.name || 'Game NFT'} 
              className="w-full h-32 object-cover rounded-md transition-transform hover:scale-105 duration-300"
            />
          </div>
        )}
        <div className="text-xs text-gray-400 flex flex-wrap gap-1">
          {nft.attributes?.map((attr, index) => (
            <span key={index} className="inline-block px-2 py-1 bg-purple-900/20 rounded-full">
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
      <div className="mt-4 mb-4">
        <label className="text-sm text-white/70 mb-2 block font-medium">
          Pay gas fees with:
        </label>
        <div className="relative">
          <select
            value={gasToken}
            onChange={(e) => setGasToken(e.target.value)}
            className="w-full p-3 bg-[#250020] rounded-lg border border-purple-900/30 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Stats display
  const StatsDisplay = () => {
    if (!userStats) return null;
    
    return (
      <div className="mt-4 p-4 bg-[#250020] rounded-lg border border-purple-900/20">
        <h3 className="text-sm font-semibold mb-3 text-white/90 border-b border-purple-900/20 pb-2">Game Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-white/50 text-xs mb-1">Games Played</span>
            <span className="font-medium">{userStats.totalPlayed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/50 text-xs mb-1">Total Wins</span>
            <span className="font-medium">{userStats.totalWins}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/50 text-xs mb-1">Win Streak</span>
            <span className="font-medium">{userStats.winStreak}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/50 text-xs mb-1">Highest Win</span>
            <span className="font-medium">{userStats.highestWin}</span>
          </div>
          <div className="flex flex-col col-span-2 mt-1 pt-2 border-t border-purple-900/20">
            <span className="text-white/50 text-xs mb-1">Total Rewards</span>
            <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">{userStats.totalRewards} GAME</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#1A0015] to-[#150012] text-white rounded-xl overflow-hidden shadow-xl w-full max-w-xs border border-purple-900/10">
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 border-b border-purple-900/10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">FuturePass</h2>
          {isConnected && (
            <button
              onClick={disconnectWallet}
              className="text-xs px-3 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-full transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </div>
            ) : (
              'Connect FuturePass Wallet'
            )}
          </button>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-[#250020] rounded-lg border border-purple-900/20">
              <div className="text-sm text-white/50 mb-1">Connected Wallet</div>
              <div className="font-mono font-medium text-lg">{formatAddress(walletAddress)}</div>
            </div>

            <div className="mb-3">
              <button
                onClick={() => setShowTokens(!showTokens)}
                className="flex justify-between items-center w-full p-3 bg-[#250020] hover:bg-[#2a0025] transition-colors rounded-lg border border-purple-900/20"
              >
                <span className="font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tokens
                </span>
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-900/20 text-purple-400 transition-transform duration-200" 
                  style={{ transform: showTokens ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>
              
              {showTokens && (
                <div className="mt-2 pl-2 pr-2 pt-2 pb-1 rounded-lg">
                  {TRN_CONFIG.feePallet.supportedTokens.map((token) => (
                    <TokenBalance key={token.symbol} token={token} />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3">
              <button
                onClick={() => setShowNFTs(!showNFTs)}
                className="flex justify-between items-center w-full p-3 bg-[#250020] hover:bg-[#2a0025] transition-colors rounded-lg border border-purple-900/20"
              >
                <span className="font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Game NFTs <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-900/30 rounded-full">{nfts.length}</span>
                </span>
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-900/20 text-purple-400 transition-transform duration-200" 
                  style={{ transform: showNFTs ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>
              
              {showNFTs && (
                <div className="mt-2 pl-2 pr-2 pt-2 pb-1 rounded-lg">
                  {nfts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-[#250020] rounded-lg border border-dashed border-purple-900/30 text-center">
                      <svg className="w-12 h-12 mb-3 text-purple-900/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div className="text-sm text-white/60 mb-1">No game NFTs found</div>
                      <div className="text-xs text-white/40">Win games to earn unique collectibles!</div>
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
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded-lg text-sm text-red-300 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturePassWallet; 