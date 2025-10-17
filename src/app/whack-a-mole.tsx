
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer } from 'lucide-react';

const GAME_DURATION_S = 30;

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION_S);
    setIsGameActive(true);
  };

  const whackMole = (index: number) => {
    if (index === activeMole) {
      setScore(prev => prev + 1);
      setActiveMole(null); // Prevent multiple whacks
    }
  };

  const getRandomMole = useCallback(() => {
      let newMole = Math.floor(Math.random() * 9);
      if (newMole === activeMole) {
          // ensure it's a new mole
          newMole = (newMole + 1) % 9;
      }
      setActiveMole(newMole);
  }, [activeMole]);

  useEffect(() => {
    if (!isGameActive) return;

    const gameInterval = setInterval(() => {
      getRandomMole();
    }, 800); // Mole appearance speed

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          setActiveMole(null);
          clearInterval(gameInterval);
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [isGameActive, getRandomMole]);
  
  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Whack-a-Mole</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6 text-xl font-bold">
            <div>Score: <span className="text-primary">{score}</span></div>
            <div>Time: <span className="text-destructive">{timeLeft}</span>s</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 aspect-square bg-green-800/50 p-4 rounded-lg">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="w-full h-full bg-yellow-900/70 rounded-full flex items-center justify-center overflow-hidden" onClick={() => whackMole(index)}>
                <div className={`transform transition-transform duration-150 ${activeMole === index ? 'translate-y-0' : 'translate-y-full'}`}>
                    <Mole />
                </div>
            </div>
          ))}
        </div>
        
        {!isGameActive ? (
          <Button onClick={startGame} size="lg" className="w-full font-bold">
            {timeLeft === 0 ? 'Play Again' : 'Start Game'}
          </Button>
        ) : (
          <div className="text-center text-2xl font-bold text-primary animate-pulse">
            GO!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const Mole = () => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-600 rounded-t-full border-4 border-yellow-800 flex flex-col items-center cursor-pointer group">
        <div className="w-full flex justify-around mt-4">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        <div className="w-4 h-2 bg-black rounded-full mt-2"></div>
        <Hammer className="absolute text-white/70 w-8 h-8 opacity-0 group-hover:opacity-100 transform -rotate-45 -translate-x-4 -translate-y-2 transition-opacity"/>
    </div>
);

