
"use client";

import { useState, useEffect } from 'react';
import Game from './game';
import GuessingGame from './guessing-game';
import RockPaperScissors from './rock-paper-scissors';
import TicTacToe from './tic-tac-toe';
import MemoryGame from './memory-game';
import WhackAMole from './whack-a-mole';
import Hangman from './hangman';
import SimonSays from './simon-says';
import { Gift, Puzzle, Hand, BrainCircuit, Hammer, VenetianMask, Gamepad2, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActiveGame = 'none' | 'mystery-box' | 'guessing-game' | 'rock-paper-scissors' | 'tic-tac-toe' | 'memory-game' | 'whack-a-mole' | 'hangman' | 'simon-says';

export default function Home() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  useEffect(() => {
    if (activeGame !== 'none') {
      document.body.classList.add('overflow-hidden');
      document.getElementById('main-content')?.classList.remove('overflow-y-auto');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.getElementById('main-content')?.classList.add('overflow-y-auto');
    }
  }, [activeGame]);

  const games = [
    { id: 'mystery-box', icon: <Gift className="w-12 h-12 text-primary" />, name: 'Mystery Box' },
    { id: 'guessing-game', icon: <Puzzle className="w-12 h-12 text-primary" />, name: 'Guess It' },
    { id: 'rock-paper-scissors', icon: <Hand className="w-12 h-12 text-primary" />, name: 'R-P-S' },
    { id: 'tic-tac-toe', icon: <Gamepad2 className="w-12 h-12 text-primary" />, name: 'Tic Tac Toe' },
    { id: 'memory-game', icon: <BrainCircuit className="w-12 h-12 text-primary" />, name: 'Memory' },
    { id: 'whack-a-mole', icon: <Hammer className="w-12 h-12 text-primary" />, name: 'Whack-a-Mole' },
    { id: 'hangman', icon: <VenetianMask className="w-12 h-12 text-primary" />, name: 'Hangman' },
    { id: 'simon-says', icon: <Brain className="w-12 h-12 text-primary" />, name: 'Simon Says' },
  ];

  const renderGame = () => {
    switch (activeGame) {
      case 'mystery-box': return <Game />;
      case 'guessing-game': return <GuessingGame />;
      case 'rock-paper-scissors': return <RockPaperScissors />;
      case 'tic-tac-toe': return <TicTacToe />;
      case 'memory-game': return <MemoryGame />;
      case 'whack-a-mole': return <WhackAMole />;
      case 'hangman': return <Hangman />;
      case 'simon-says': return <SimonSays />;
      default:
        return (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {games.map(game => (
              <div 
                key={game.id}
                className="flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => setActiveGame(game.id as ActiveGame)}
              >
                <div className="p-6 bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300 w-full aspect-square flex flex-col justify-center items-center">
                  {game.icon}
                  <p className="mt-2 text-sm sm:text-base font-bold text-foreground/80 text-center">{game.name}</p>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const resetToHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveGame('none');
  };

  return (
    <main 
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 relative"
      )}
    >
       {activeGame !== 'none' && (
         <button onClick={resetToHome} className="absolute top-24 left-4 text-primary font-bold z-50 bg-card/80 px-3 py-1 rounded-full shadow-md hover:bg-card transition-colors">
           &larr; Back to Games
         </button>
      )}
      {renderGame()}
    </main>
  );
}
