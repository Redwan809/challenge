
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, Gem, Scroll, RefreshCw, Trophy, XCircle, Minus } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const choices: Choice[] = ['rock', 'paper', 'scissors'];

const choiceIcons = {
  rock: <Gem className="w-12 h-12" />,
  paper: <Scroll className="w-12 h-12" />,
  scissors: <Hand className="w-12 h-12" />,
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const handlePlayerChoice = (choice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);

    if (choice === computerChoice) {
      setResult('draw');
    } else if (
      (choice === 'rock' && computerChoice === 'scissors') ||
      (choice === 'paper' && computerChoice === 'rock') ||
      (choice === 'scissors' && computerChoice === 'paper')
    ) {
      setResult('win');
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('lose');
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const ResultDisplay = useMemo(() => {
    if (!result) {
      return <p className="text-lg font-bold min-h-[56px] flex items-center justify-center">Choose your weapon!</p>;
    }
    
    let text = '';
    let icon: React.ReactNode = null;
    let textColor = '';

    if (result === 'win') {
      text = 'You Win!';
      icon = <Trophy className="mr-2 text-yellow-400" />;
      textColor = 'text-green-500';
    } else if (result === 'lose') {
      text = 'You Lose!';
      icon = <XCircle className="mr-2" />;
      textColor = 'text-red-500';
    } else {
      text = "It's a Draw!";
      icon = <Minus className="mr-2" />;
      textColor = 'text-muted-foreground';
    }
    return (
      <div className={`text-2xl font-bold min-h-[56px] flex items-center justify-center animate-bounce-in ${textColor}`}>
        {icon}
        {text}
      </div>
    );
  }, [result]);

  return (
    <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Rock Paper Scissors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-center mb-6 text-xl font-bold">
            <div>Player: <span className="text-primary">{score.player}</span></div>
            <div>Computer: <span className="text-destructive">{score.computer}</span></div>
        </div>

        <div className="flex justify-around items-center h-32 mb-6">
            <div className="flex flex-col items-center gap-2">
                <p className="font-bold">You</p>
                <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full text-primary">
                    {playerChoice ? choiceIcons[playerChoice] : '?'}
                </div>
            </div>
            <p className="text-4xl font-bold text-foreground/80">VS</p>
            <div className="flex flex-col items-center gap-2">
                <p className="font-bold">CPU</p>
                <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full text-destructive">
                    {computerChoice ? choiceIcons[computerChoice] : '?'}
                </div>
            </div>
        </div>

        <div className="mb-6">{ResultDisplay}</div>
        
        {result ? (
          <Button onClick={resetGame} size="lg" className="w-full font-bold">
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        ) : (
          <div className="flex justify-center gap-4">
            {choices.map(choice => (
              <Button key={choice} onClick={() => handlePlayerChoice(choice)} size="lg" variant="secondary" className="transform hover:scale-110 transition-transform">
                {choiceIcons[choice]}
              </Button>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
