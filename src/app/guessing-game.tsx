
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, HelpCircle, RefreshCw, XCircle } from 'lucide-react';

const MAX_NUMBER = 100;

export default function GuessingGame() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100.');
  const [messageType, setMessageType] = useState<'hint' | 'success' | 'error' | 'info'>('info');
  const [guesses, setGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startNewGame = useCallback(() => {
    setTargetNumber(Math.floor(Math.random() * MAX_NUMBER) + 1);
    setGuess('');
    setMessage(`Guess a number between 1 and ${MAX_NUMBER}.`);
    setMessageType('info');
    setGuesses(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > MAX_NUMBER) {
      setMessageType('error');
      setMessage(`Please enter a number between 1 and ${MAX_NUMBER}.`);
      return;
    }

    const currentGuesses = guesses + 1;
    setGuesses(currentGuesses);

    if (numGuess === targetNumber) {
      const points = Math.max(10, MAX_NUMBER - (currentGuesses -1) * 5);
      setMessageType('success');
      setMessage(`You got it in ${currentGuesses} guesses! The number was ${targetNumber}. You earned ${points} points.`);
      setScore(prev => prev + points);
      setGameOver(true);
    } else if (numGuess < targetNumber) {
      setMessageType('hint');
      setMessage('Too low! Try again.');
    } else {
      setMessageType('hint');
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  const getAlertIcon = () => {
    switch(messageType) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'hint': return <HelpCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  }

  return (
    <Card className="w-full max-w-xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Guess the Number</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-right font-bold mb-4">Score: <span className="text-primary">{score}</span></div>
        <Alert variant={messageType === 'error' ? 'destructive' : 'default'} className="mb-6 min-h-[90px]">
          {getAlertIcon()}
          <AlertTitle>{messageType.charAt(0).toUpperCase() + messageType.slice(1)}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>

        {!gameOver ? (
          <div className="flex w-full items-center space-x-2">
            <Input
              type="number"
              placeholder="Your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              disabled={gameOver}
              className="text-lg"
            />
            <Button onClick={handleGuess} disabled={gameOver} size="lg">Guess</Button>
          </div>
        ) : (
          <Button onClick={startNewGame} size="lg" className="w-full font-bold">
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        )}
        
        <p className="text-center text-muted-foreground mt-4">Guesses: {guesses}</p>
      </CardContent>
    </Card>
  );
}
