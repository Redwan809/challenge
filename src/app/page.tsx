
"use client";

import { useState } from 'react';
import Game from './game';
import { Gift } from 'lucide-react';

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary">
          Mystery Box Challenge
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          Find the ball and test your luck!
        </p>
      </div>

      {showGame ? (
        <Game />
      ) : (
        <div 
          className="flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => setShowGame(true)}
        >
          <div className="p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
            <Gift className="w-24 h-24 text-primary" />
          </div>
          <p className="mt-4 text-lg font-bold text-foreground/90">Click to Play</p>
        </div>
      )}
    </main>
  );
}
