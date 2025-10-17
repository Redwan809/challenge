
"use client";

import { useState } from 'react';
import Game from './game';
import { Gift } from 'lucide-react';

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 relative">
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
          <p className="mt-4 text-lg font-bold text-foreground/90">Mystery Box</p>
        </div>
      )}
    </main>
  );
}
