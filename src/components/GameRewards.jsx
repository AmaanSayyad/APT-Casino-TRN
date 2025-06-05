"use client";

import { useState, useEffect } from 'react';
import { useTRN } from '@/hooks/useTRN';
import { GAME_REWARDS } from '@/lib/trn/config';
import { formatCurrency, formatDate } from '@/utils/formatters';

const GameRewards = () => {
  const { userStats, nfts, isConnected, walletAddress } = useTRN();
  const [showAchievements, setShowAchievements] = useState(true);
  
  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-[#1A0015] to-[#150012] text-white rounded-xl overflow-hidden shadow-xl w-full mb-4 border border-purple-900/10">
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 border-b border-purple-900/10">
          <h2 className="text-lg font-bold">Game Rewards</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <svg className="w-12 h-12 mb-3 text-purple-900/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-white/70 text-center">
            Connect your FuturePass wallet to earn and view rewards.
          </p>
        </div>
      </div>
    );
  }
  
  // Achievement card
  const AchievementCard = ({ achievement, earned = false, date = null }) => {
    const achievementConfig = GAME_REWARDS.achievements.find(a => a.id === achievement.id) || {
      name: achievement.name,
      reward: '?',
      type: 'GAME',
    };
    
    return (
      <div className={`
        p-4 rounded-lg mb-3 border transition-all duration-200
        ${earned 
          ? 'bg-[#250025] border-purple-700/50 hover:bg-[#2a0029]' 
          : 'bg-[#250020] border-purple-900/20 hover:bg-[#2a0025]'}
      `}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{achievementConfig.name}</h3>
            <p className="text-sm text-white/60 mt-1">
              Reward: <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">{achievementConfig.reward} {achievementConfig.type}</span>
            </p>
            {earned && date && (
              <p className="text-xs text-white/40 mt-1">
                Earned: {formatDate(date, true)}
              </p>
            )}
          </div>
          {earned ? (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Earned
            </div>
          ) : (
            <div className="bg-[#2a0025] text-xs px-3 py-1 rounded-full text-white/50 border border-purple-900/20">
              Locked
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Daily rewards progress
  const DailyRewardsProgress = () => {
    const maxReward = parseFloat(GAME_REWARDS.dailyRewards.maxDailyReward);
    const loginBonus = parseFloat(GAME_REWARDS.dailyRewards.loginBonus);
    const completedGames = userStats?.totalPlayed || 0;
    const gameReward = parseFloat(GAME_REWARDS.dailyRewards.completedGames);
    
    const earnedToday = Math.min(loginBonus + (completedGames * gameReward), maxReward);
    const progressPercent = (earnedToday / maxReward) * 100;
    
    return (
      <div className="mb-5 p-4 bg-[#250020] rounded-lg border border-purple-900/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Daily Rewards
          </h3>
          <span className="text-xs font-mono bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text font-semibold">
            {formatCurrency(earnedToday)} / {formatCurrency(maxReward)} GAME
          </span>
        </div>
        <div className="w-full h-3 bg-[#1a0015] rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/50">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span>Login: {GAME_REWARDS.dailyRewards.loginBonus} GAME</span>
          </div>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Per game: {GAME_REWARDS.dailyRewards.completedGames} GAME</span>
          </div>
        </div>
      </div>
    );
  };
  
  // NFT collection
  const NFTCollection = () => {
    if (!nfts || nfts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#250020] rounded-lg border border-dashed border-purple-900/30 text-center">
          <svg className="w-16 h-16 mb-4 text-purple-900/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-white/70 mb-2">You haven't earned any NFTs yet.</p>
          <p className="text-sm text-white/50">Win games and complete achievements to earn rare collectibles!</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {nfts.map((nft, index) => (
          <div key={index} className="bg-[#250020] hover:bg-[#2a0025] transition-colors rounded-lg p-4 border border-purple-900/20">
            {nft.image && (
              <div className="relative overflow-hidden rounded-lg mb-3 border border-purple-900/30">
                <img 
                  src={nft.image} 
                  alt={nft.name || 'Game NFT'} 
                  className="w-full h-32 object-cover rounded-md transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}
            <h3 className="font-medium text-sm mb-2">{nft.name || 'Game NFT'}</h3>
            <div className="flex flex-wrap gap-1">
              {nft.attributes?.map((attr, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-purple-900/20 rounded-full text-xs text-white/70">
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-b from-[#1A0015] to-[#150012] text-white rounded-xl overflow-hidden shadow-xl w-full mb-4 border border-purple-900/10">
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 border-b border-purple-900/10">
        <h2 className="text-lg font-bold">Game Rewards</h2>
      </div>
      
      <div className="p-4">
        <DailyRewardsProgress />
        
        <div className="flex border-b border-purple-900/20 mb-4">
          <button
            onClick={() => setShowAchievements(true)}
            className={`py-2 px-4 text-sm font-medium flex items-center ${
              showAchievements 
                ? 'border-b-2 border-purple-500 text-white' 
                : 'text-white/50 hover:text-white/70 transition-colors'
            }`}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            Achievements
          </button>
          <button
            onClick={() => setShowAchievements(false)}
            className={`py-2 px-4 text-sm font-medium flex items-center ${
              !showAchievements 
                ? 'border-b-2 border-purple-500 text-white' 
                : 'text-white/50 hover:text-white/70 transition-colors'
            }`}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            NFT Collection
          </button>
        </div>
        
        {showAchievements ? (
          <div className="space-y-4">
            {/* Earned achievements */}
            {userStats?.achievements && userStats.achievements.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-3 text-white/90 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Earned
                </h3>
                {userStats.achievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                    earned={true}
                    date={achievement.awardedAt}
                  />
                ))}
              </div>
            )}
            
            {/* Available achievements */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-white/90 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
                Available
              </h3>
              {GAME_REWARDS.achievements
                .filter(a => !userStats?.achievements?.some(earned => earned.id === a.id))
                .map((achievement) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                    earned={false}
                  />
                ))
              }
            </div>
          </div>
        ) : (
          <NFTCollection />
        )}
      </div>
    </div>
  );
};

export default GameRewards; 