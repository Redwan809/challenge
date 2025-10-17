
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="flex justify-center gap-2 sm:gap-4 mb-8 text-3xl sm:text-4xl font-bold font-mono">
      {word.split('').map((letter, index) => (
        <span key={index} className="w-10 h-14 sm:w-12 sm:h-16 border-b-4 border-foreground flex items-center justify-center">
          {guessedLetters.includes(letter) || isLoser ? letter.toUpperCase() : '_'}
        </span>
      ))}
    </div>
  );

  const HangmanDrawing = () => {
    const parts = [
      <line key="base" x1="60" y1="210" x2="140" y2="210" stroke="currentColor" strokeWidth="4" />, // Base
      <line key="pole" x1="100" y1="210" x2="100" y2="50" stroke="currentColor" strokeWidth="4" />, // Pole
      <line key="beam" x1="100" y1="50" x2="180" y2="50" stroke="currentColor" strokeWidth="4" />, // Beam
      <line key="rope" x1="180" y1="50" x2="180" y2="80" stroke="currentColor" strokeWidth="4" />, // Rope
      <circle key="head" cx="180" cy="100" r="20" stroke="currentColor" strokeWidth="4" fill="none" />, // Head
      <line key="body" x1="180" y1="120" x2="180" y2="160" stroke="currentColor" strokeWidth="4" />, // Body
      <line key="arm-l" x1="180" y1="130" x2="150" y2="150" stroke="currentColor" strokeWidth="4" />, // Left Arm
      <line key="arm-r" x1="180" y1="130" x2="210" y2="150" stroke="currentColor" strokeWidth="4" />, // Right Arm
      <line key="leg-l" x1="180" y1="160" x2="150" y2="190" stroke="currentColor" strokeWidth="4" />, // Left Leg
      <line key="leg-r" x1="180" y1="160" x2="210" y2="190" stroke="currentColor" strokeWidth="4" />, // Right Leg
    ];
    
    return (
      <svg viewBox="0 0 250 250" className="w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-4">
        {parts.slice(0, wrongGuesses + 4).slice(4)}
      </svg>
    )
  }

  return (
    <Card className="w-full max-w-xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Hangman</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <HangmanDrawing />
        {isGameOver ? (
            <div className="text-center mb-8">
                <p className={`text-3xl font-bold mb-2 ${isWinner ? 'text-green-500' : 'text-red-500'}`}>
                    {isWinner ? 'You Win!' : 'You Lose!'}
                </p>
                <p className="text-xl">The word was: <span className="font-bold text-primary">{word.toUpperCase()}</span></p>
            </div>
        ) : (
            <WordDisplay />
        )}

        {isGameOver ? (
          <Button onClick={startNewGame} size="lg">Play Again</Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {alphabet.map(letter => {
              const isGuessed = guessedLetters.includes(letter);
              return (
                <Button
                  key={letter}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 text-lg"
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
