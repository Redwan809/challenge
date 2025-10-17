
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
import { Gift, Puzzle, Hand, BrainCircuit, Hammer, VenetianMask, Gamepad2, Brain, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ActiveGame = 'none' | 'mystery-box' | 'guessing-game' | 'rock-paper-scissors' | 'tic-tac-toe' | 'memory-game' | 'whack-a-mole' | 'hangman' | 'simon-says';

export default function Home() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (activeGame !== 'none') {
        mainContent.classList.remove('overflow-y-auto');
        mainContent.classList.add('overflow-hidden');
      } else {
        mainContent.classList.add('overflow-y-auto');
        mainContent.classList.remove('overflow-hidden');
      }
    }
  }, [activeGame]);

  const games = [
    { id: 'mystery-box', icon: <Gift className="w-12 h-12" />, name: 'Mystery Box' },
    { id: 'guessing-game', icon: <Puzzle className="w-12 h-12" />, name: 'Guess It' },
    { id: 'rock-paper-scissors', icon: <Hand className="w-12 h-12" />, name: 'R-P-S' },
    { id: 'tic-tac-toe', icon: <Gamepad2 className="w-12 h-12" />, name: 'Tic Tac Toe' },
    { id: 'memory-game', icon: <BrainCircuit className="w-12 h-12" />, name: 'Memory' },
    { id: 'whack-a-mole', icon: <Hammer className="w-12 h-12" />, name: 'Whack-a-Mole' },
    { id: 'hangman', icon: <VenetianMask className="w-12 h-12" />, name: 'Hangman' },
    { id: 'simon-says', icon: <Brain className="w-12 h-12" />, name: 'Simon Says' },
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
                <div className="p-6 bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300 w-full aspect-square flex flex-col justify-center items-center text-primary">
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
        "flex min-h-full w-full flex-col items-center justify-center p-4 sm:p-8 relative"
      )}
    >
       {activeGame !== 'none' && (
         <Button onClick={resetToHome} variant="ghost" size="icon" className="absolute top-20 left-4 sm:left-6 z-50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
            <ArrowLeft className="w-6 h-6 text-primary" />
            <span className="sr-only">Back to Games</span>
         </Button>
      )}
      {renderGame()}
    </main>
  );
}
