
"use client";

import { useState } from 'react';
import Game from './game';
import GuessingGame from './guessing-game';
import { Gift, Puzzle } from 'lucide-react';

type ActiveGame = 'none' | 'mystery-box' | 'guessing-game';

export default function Home() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  const renderGame = () => {
    switch (activeGame) {
      case 'mystery-box':
        return <Game />;
      case 'guessing-game':
        return <GuessingGame />;
      default:
        return (
          <div className="flex items-center justify-center gap-8">
            <div 
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setActiveGame('mystery-box')}
            >
              <div className="p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-24 h-24 text-primary" />
              </div>
            </div>
            <div 
              className="flex flex-col items-center justify-center cursor-pointer group"
               onClick={() => setActiveGame('guessing-game')}
            >
              <div className="p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <Puzzle className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 relative">
      {renderGame()}
    </main>
  );
}
