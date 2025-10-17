
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const words = ["react", "nextjs", "tailwind", "firebase", "genkit", "studio"];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const MAX_WRONG_GUESSES = 6;

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  
  const startNewGame = useCallback(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const wrongGuesses = guessedLetters.filter(letter => !word.includes(letter)).length;
  const isWinner = word.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuesses >= MAX_WRONG_GUESSES;
  const isGameOver = isWinner || isLoser;

  const handleGuess = (letter: string) => {
    if (isGameOver || guessedLetters.includes(letter)) return;
    setGuessedLetters(prev => [...prev, letter]);
  };

  const WordDisplay = () => (
    <div className="flex justify-center gap-1 sm:gap-2 mb-8 text-2xl sm:text-4xl font-bold font-mono flex-wrap">
      {word.split('').map((letter, index) => (
        <span key={index} className="w-8 h-12 sm:w-12 sm:h-16 border-b-4 border-foreground flex items-center justify-center">
          {(guessedLetters.includes(letter) || isLoser) ? letter.toUpperCase() : ''}
        </span>
      ))}
    </div>
  );

  const HangmanDrawing = () => {
    const Head = <circle key="head" cx="180" cy="100" r="20" strokeWidth="4" fill="none" stroke="currentColor"/>;
    const Body = <line key="body" x1="180" y1="120" x2="180" y2="160" strokeWidth="4" stroke="currentColor"/>;
    const RightArm = <line key="arm-r" x1="180" y1="130" x2="210" y2="150" strokeWidth="4" stroke="currentColor"/>;
    const LeftArm = <line key="arm-l" x1="180" y1="130" x2="150" y2="150" strokeWidth="4" stroke="currentColor"/>;
    const RightLeg = <line key="leg-r" x1="180" y1="160" x2="210" y2="190" strokeWidth="4" stroke="currentColor"/>;
    const LeftLeg = <line key="leg-l" x1="180" y1="160" x2="150" y2="190" strokeWidth="4" stroke="currentColor"/>;
    
    const bodyParts = [Head, Body, RightArm, LeftArm, RightLeg, LeftLeg];

    return (
      <svg viewBox="0 0 250 250" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
          {/* Gallows */}
          <line x1="60" y1="230" x2="140" y2="230" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="230" x2="100" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="50" x2="180" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="180" y1="50" x2="180" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Body parts */}
          {bodyParts.slice(0, wrongGuesses).map((part, index) => React.cloneElement(part, { key: `body-part-${index}` }))}
      </svg>
    )
  }

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Hangman</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4 sm:p-6">
        <HangmanDrawing />
        {isGameOver ? (
            <div className="text-center mb-8">
                <p className={`text-2xl sm:text-3xl font-bold mb-2 ${isWinner ? 'text-primary' : 'text-destructive'}`}>
                    {isWinner ? 'You Win!' : 'You Lose!'}
                </p>
                <p className="text-lg sm:text-xl">The word was: <span className="font-bold text-primary">{word.toUpperCase()}</span></p>
            </div>
        ) : (
            <WordDisplay />
        )}

        {isGameOver ? (
          <Button onClick={startNewGame} size="lg" className="animate-bounce-in">
              <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {alphabet.map(letter => {
              const isGuessed = guessedLetters.includes(letter);
              return (
                <Button
                  key={letter}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 text-base sm:text-lg"
                  disabled={isGuessed}
                  onClick={() => handleGuess(letter)}
                >
                  {letter.toUpperCase()}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
