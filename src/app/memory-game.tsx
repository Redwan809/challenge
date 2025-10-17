
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Apple, Ghost, Anchor, Sun, Heart, Diamond, Star, Bomb } from 'lucide-react';

const icons = [Apple, Ghost, Anchor, Sun, Heart, Diamond, Star, Bomb];
const cardIcons = [...icons, ...icons];

const shuffle = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; Icon: React.ElementType; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const startNewGame = useCallback(() => {
    const shuffledIcons = shuffle(cardIcons);
    setCards(shuffledIcons.map((Icon, index) => ({ id: index, Icon, isFlipped: false, isMatched: false })));
    setFlippedIndices([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].Icon === cards[secondIndex].Icon) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            (index === firstIndex || index === secondIndex) ? { ...card, isMatched: true } : card
          ));
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            (index === firstIndex || index === secondIndex) ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) return;

    setCards(prev => prev.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
    setFlippedIndices(prev => [...prev, index]);
  };
  
  const allMatched = cards.length > 0 && cards.every(card => card.isMatched);

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Memory Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-lg">Moves: <span className="text-primary">{moves}</span></p>
            <Button onClick={startNewGame} size="sm" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
          {cards.map((card, index) => (
            <div key={card.id} className="aspect-square" onClick={() => handleCardClick(index)}>
              <div className={cn(
                "w-full h-full rounded-lg flex items-center justify-center transition-transform duration-500",
                "transform-style-3d",
                card.isFlipped ? "rotate-y-180" : ""
              )}>
                <div className={cn("absolute w-full h-full backface-hidden", card.isFlipped ? "z-0" : "z-10")}>
                    <div className="w-full h-full bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"></div>
                </div>
                <div className={cn("absolute w-full h-full backface-hidden rotate-y-180", card.isFlipped ? "z-10" : "z-0")}>
                    <div className={cn("w-full h-full rounded-lg flex items-center justify-center", card.isMatched ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent")}>
                        <card.Icon className="w-1/2 h-1/2" />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {allMatched && moves > 0 && (
          <div className="text-center animate-bounce-in">
            <p className="text-2xl font-bold text-primary mb-4">You won in {moves} moves!</p>
            <Button onClick={startNewGame} size="lg">
                <RefreshCw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </div>
        )}

      </CardContent>
       <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </Card>
  );
}
