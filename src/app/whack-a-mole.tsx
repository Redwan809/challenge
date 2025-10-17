
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, RefreshCw } from 'lucide-react';

const GAME_DURATION_S = 30;
const MOLE_APPEAR_SPEED_MS = 800;

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const popMole = useCallback(() => {
    setActiveMole(Math.floor(Math.random() * 9));
  }, []);

  const stopGame = useCallback(() => {
    setIsGameActive(false);
    setIsGameOver(true);
    setActiveMole(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION_S);
    setIsGameOver(false);
    setIsGameActive(true);
  };

  useEffect(() => {
    if (isGameActive) {
      popMole(); // Initial mole
      gameLoopRef.current = setInterval(popMole, MOLE_APPEAR_SPEED_MS);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
       if (timerRef.current) clearInterval(timerRef.current);
       if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isGameActive, popMole, stopGame]);
  

  const whackMole = (index: number) => {
    if (index === activeMole && isGameActive) {
      setScore(prev => prev + 1);
      
      // Immediately pop a new mole and reset interval to keep it snappy
      if (gameLoopRef.current) {
         clearInterval(gameLoopRef.current);
      }
      popMole();
      gameLoopRef.current = setInterval(popMole, MOLE_APPEAR_SPEED_MS);
    }
  };
  
  return (
    <Card className="w-full max-w-xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
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
            <div 
              key={index} 
              className="w-full h-full bg-yellow-900/70 rounded-full flex items-center justify-center overflow-hidden cursor-pointer group" 
              onClick={() => whackMole(index)}
              role="button"
              aria-label={`mole-hole-${index}`}
            >
                <div className={`transform transition-transform duration-150 ${activeMole === index ? 'translate-y-0' : 'translate-y-full'}`}>
                    <Mole />
                </div>
                <Hammer className={`absolute text-white/70 w-8 h-8 opacity-0 group-active:opacity-100 transform -rotate-45 -translate-x-4 -translate-y-2 transition-opacity`}/>
            </div>
          ))}
        </div>
        
        {!isGameActive && (
          <Button onClick={startGame} size="lg" className="w-full font-bold">
             {isGameOver ? <><RefreshCw className="mr-2 h-4 w-4" />Play Again</> : 'Start Game'}
          </Button>
        )}
        {isGameActive && (
           <div className="text-center text-2xl font-bold text-primary animate-pulse h-11 flex items-center justify-center">
            GO!
          </div>
        )}

      </CardContent>
    </Card>
  );
}

const Mole = () => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-600 rounded-t-full border-4 border-yellow-800 flex flex-col items-center">
        <div className="w-full flex justify-around mt-4">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        <div className="w-4 h-2 bg-black rounded-full mt-2"></div>
    </div>
);
