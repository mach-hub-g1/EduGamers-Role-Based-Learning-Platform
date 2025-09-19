'use client';

import { GameHub } from '@/components/games/GameHub';

export default function GamesPage() {
  // Mock user data - replace with actual user data from your auth/provider
  const userStats = {
    userName: 'Amandeep',
    level: 12,
    totalXP: 2526,
    dayStreak: 7,
    gamesPlayed: 90,
    achievements: 23,
    progress: 75,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <GameHub {...userStats} />
      </div>
    </div>
  );
}
