
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colors = ['green', 'red', 'yellow', 'blue'];
const colorClasses = {
  green: 'bg-green-500 hover:bg-green-600',
  red: 'bg-red-500 hover:bg-red-600',
  yellow: 'bg-yellow-400 hover:bg-yellow-500',
  blue: 'bg-blue-500 hover:bg-blue-600',
};
const activeColorClasses = {
  green: 'bg-green-300',
  red: 'bg-red-300',
  yellow: 'bg-yellow-200',
  blue: 'bg-blue-300',
}

type GameStatus = 'start' | 'sequence' | 'input' | 'gameover';

export default function SimonSays() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>('start');
  const [score, setScore] = useState(0);

  const nextTurn = useCallback(() => {
    setStatus('sequence');
    setPlayerInput([]);
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, nextColor];
    setSequence(newSequence);

    newSequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
        setTimeout(() => setActiveColor(null), 300);
      }, (index + 1) * 600);
    });
    
    setTimeout(() => setStatus('input'), newSequence.length * 600);

  }, [sequence]);


  const startGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setScore(0);
    setStatus('sequence');
    // We call nextTurn inside a timeout to ensure state is reset before it runs
    setTimeout(() => {
        const firstColor = colors[Math.floor(Math.random() * colors.length)];
        setSequence([firstColor]);
        setActiveColor(firstColor);
        setTimeout(() => setActiveColor(null), 300);
        setTimeout(() => setStatus('input'), 600);
    }, 100);
  };
  
  const handlePlayerClick = (color: string) => {
    if (status !== 'input') return;

    const newPlayerInput = [...playerInput, color];
    setPlayerInput(newPlayerInput);

    if (newPlayerInput[newPlayerInput.length - 1] !== sequence[newPlayerInput.length - 1]) {
      setStatus('gameover');
      return;
    }

    if (newPlayerInput.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => nextTurn(), 1000);
    }
  };
  
  const getStatusMessage = () => {
      switch (status) {
        case 'start': return 'Press Start';
        case 'sequence': return 'Watch Carefully...';
        case 'input': return 'Your Turn!';
        case 'gameover': return 'Game Over!';
        default: return '';
      }
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Simon Says</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-bold">Score: <span className="text-primary">{score}</span></p>
          <p className="text-xl font-bold min-w-[150px] text-center">{getStatusMessage()}</p>
        </div>

        <div className="relative aspect-square w-full max-w-xs mx-auto mb-6">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                {colors.map((color, index) => (
                    <button
                        key={color}
                        onClick={() => handlePlayerClick(color)}
                        disabled={status !== 'input'}
                        className={cn(
                            "w-full h-full transition-colors duration-200",
                            colorClasses[color as keyof typeof colorClasses],
                            activeColor === color && activeColorClasses[color as keyof typeof activeColorClasses],
                            index === 0 && "rounded-tl-full",
                            index === 1 && "rounded-tr-full",
                            index === 2 && "rounded-bl-full",
                            index === 3 && "rounded-br-full",
                            status !== 'input' && "cursor-not-allowed opacity-75"
                        )}
                    />
                ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-card rounded-full flex items-center justify-center">
                 <p className="font-bold text-card-foreground text-3xl">SIMON</p>
            </div>
        </div>

        {status === 'start' || status === 'gameover' ? (
          <Button onClick={startGame} size="lg" className="w-full">
            {status === 'start' ? 'Start Game' : 'Play Again'}
          </Button>
        ) : (
          <div className="h-11"></div>
        )}
      </CardContent>
    </Card>
  );
}

