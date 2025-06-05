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
      <div className="bg-gray-900 text-white rounded-xl p-4 shadow-lg w-full mb-4">
        <h2 className="text-lg font-bold mb-3">Game Rewards</h2>
        <p className="text-gray-400 text-sm">
          Connect your FuturePass wallet to earn and view rewards.
        </p>
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
        p-3 rounded-lg mb-3 border
        ${earned 
          ? 'bg-purple-900/30 border-purple-700' 
          : 'bg-gray-800 border-gray-700'}
      `}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{achievementConfig.name}</h3>
            <p className="text-sm text-gray-400">
              Reward: {achievementConfig.reward} {achievementConfig.type}
            </p>
            {earned && date && (
              <p className="text-xs text-gray-500 mt-1">
                Earned: {formatDate(date, true)}
              </p>
            )}
          </div>
          {earned ? (
            <div className="bg-purple-600 text-xs px-2 py-1 rounded-full">
              Earned
            </div>
          ) : (
            <div className="bg-gray-700 text-xs px-2 py-1 rounded-full">
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
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium">Daily Rewards</h3>
          <span className="text-xs text-gray-400">
            {formatCurrency(earnedToday)} / {formatCurrency(maxReward)} GAME
          </span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Login bonus: {GAME_REWARDS.dailyRewards.loginBonus} GAME</span>
          <span>Per game: {GAME_REWARDS.dailyRewards.completedGames} GAME</span>
        </div>
      </div>
    );
  };
  
  // NFT collection
  const NFTCollection = () => {
    if (!nfts || nfts.length === 0) {
      return (
        <div className="text-center p-4 text-gray-400">
          <p>You haven't earned any NFTs yet.</p>
          <p className="text-sm mt-2">Win games and complete achievements to earn rare NFTs!</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {nfts.map((nft, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-3">
            {nft.image && (
              <img 
                src={nft.image} 
                alt={nft.name || 'Game NFT'} 
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <h3 className="font-medium text-sm">{nft.name || 'Game NFT'}</h3>
            <div className="text-xs text-gray-400 mt-1">
              {nft.attributes?.map((attr, index) => (
                <span key={index} className="mr-2">
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
    <div className="bg-gray-900 text-white rounded-xl p-4 shadow-lg w-full mb-4">
      <h2 className="text-lg font-bold mb-3">Game Rewards</h2>
      
      <DailyRewardsProgress />
      
      <div className="flex border-b border-gray-700 mb-3">
        <button
          onClick={() => setShowAchievements(true)}
          className={`py-2 px-4 text-sm font-medium ${
            showAchievements ? 'border-b-2 border-purple-500' : 'text-gray-400'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setShowAchievements(false)}
          className={`py-2 px-4 text-sm font-medium ${
            !showAchievements ? 'border-b-2 border-purple-500' : 'text-gray-400'
          }`}
        >
          NFT Collection
        </button>
      </div>
      
      {showAchievements ? (
        <div>
          {/* Earned achievements */}
          {userStats?.achievements && userStats.achievements.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2">Earned</h3>
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
            <h3 className="text-sm font-medium mb-2">Available</h3>
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
  );
};

export default GameRewards; 