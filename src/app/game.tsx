"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { GiftBox } from '@/components/game/gift-box';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, PartyPopper, RefreshCw, XCircle } from 'lucide-react';
import { BallIcon } from '@/components/game/ball-icon';

type GameStatus = 'initial' | 'placing' | 'shuffling' | 'selecting' | 'revealed';

const BOX_COUNT = 3;
const SHUFFLE_COUNT = 5;
const SHUFFLE_SPEED_MS = 400;

export default function Game() {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('initial');
  const [boxes, setBoxes] = useState<{ id: number; hasBall: boolean }[]>(
    Array.from({ length: BOX_COUNT }, (_, i) => ({ id: i, hasBall: i === Math.floor(BOX_COUNT / 2) }))
  );
  const [boxOrder, setBoxOrder] = useState<number[]>(Array.from({ length: BOX_COUNT }, (_, i) => i));
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; icon: React.ReactNode }>({ text: 'Click Start to Play!', icon: <PartyPopper className="text-accent-foreground" /> });
  const [isAnimatingBall, setIsAnimatingBall] = useState(false);

  const boxPositions = useMemo(() => {
    const positions: { [key: number]: string } = {};
    const baseOffset = 115;
    boxOrder.forEach((id, index) => {
      const position = (index - Math.floor(BOX_COUNT / 2)) * baseOffset;
      positions[id] = `${position}%`;
    });
    return positions;
  }, [boxOrder]);

  const handleShuffle = useCallback(async () => {
    setStatus('shuffling');
    setMessage({ text: 'Shuffling...', icon: null });

    let currentOrder = [...boxOrder];
    for (let i = 0; i < SHUFFLE_COUNT; i++) {
      await new Promise((resolve) => setTimeout(resolve, SHUFFLE_SPEED_MS));
      currentOrder.sort(() => Math.random() - 0.5);
      setBoxOrder([...currentOrder]);
    }
    
    await new Promise((resolve) => setTimeout(resolve, SHUFFLE_SPEED_MS));
    setStatus('selecting');
    setMessage({ text: 'Where is the ball? Select a box!', icon: null });
  }, [boxOrder]);

  const handleStart = () => {
    setSelectedBox(null);
    setBoxes(Array.from({ length: BOX_COUNT }, (_, i) => ({ id: i, hasBall: i === Math.floor(BOX_COUNT / 2) })));
    setBoxOrder(Array.from({ length: BOX_COUNT }, (_, i) => i));

    setStatus('placing');
    setMessage({ text: 'Watch the ball!', icon: null });
    setIsAnimatingBall(true);

    setTimeout(() => {
      setIsAnimatingBall(false);
      handleShuffle();
    }, 1500);
  };

  const handleSelectBox = (index: number) => {
    if (status !== 'selecting') return;
    
    const chosenBoxId = boxOrder[index];
    setSelectedBox(index);
    setStatus('revealed');
    
    const correct = boxes.find(box => box.id === chosenBoxId)?.hasBall;

    if (correct) {
      setScore(prev => prev + 1);
      setMessage({ text: "You found it! 🎉", icon: <PartyPopper className="text-green-500" /> });
    } else {
      setMessage({ text: "Better luck next time!", icon: <XCircle className="text-red-500" /> });
    }
  };

  const isGameInProgress = status === 'shuffling' || status === 'placing' || status === 'selecting';

  return (
    <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Score: <span className="text-primary font-headline text-2xl">{score}</span></h3>
          <div className="text-center h-12 flex items-center justify-center font-bold text-lg animate-bounce-in">
            {message.icon}
            <span className="ml-2">{message.text}</span>
          </div>
        </div>

        <div className="relative flex justify-center items-end h-48 w-full mb-8">
          {boxes.map((box, i) => (
            <div
              key={box.id}
              className="absolute transition-all duration-500 ease-in-out"
              style={{ transform: `translateX(${boxPositions[box.id]})` }}
            >
              <GiftBox
                hasBall={box.hasBall}
                isRevealed={status === 'revealed'}
                isSelected={selectedBox !== null && boxOrder[selectedBox] === box.id}
                onClick={() => handleSelectBox(i)}
                isDisabled={status !== 'selecting'}
              />
            </div>
          ))}

          {status === 'placing' && isAnimatingBall && (
             <div className="absolute bottom-1/2 z-20" style={{ animation: 'place-ball 1.5s ease-in-out forwards' }}>
                <BallIcon className="w-8 h-8"/>
             </div>
          )}
        </div>

        <div className="flex justify-center">
          {status === 'initial' || status === 'revealed' ? (
            <Button
              size="lg"
              onClick={handleStart}
              className="font-bold text-xl shadow-lg transform hover:scale-105 transition-transform"
            >
              {status === 'initial' ? 'Start Game' : 'Play Again'}
              {status === 'initial' ? <ArrowRight className="ml-2" /> : <RefreshCw className="ml-2" />}
            </Button>
          ) : (
            <Button size="lg" disabled className="font-bold text-xl">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              {status === 'placing' ? 'Placing Ball...' : 'Shuffling...'}
            </Button>
          )}
        </div>
      </CardContent>
       <style jsx>{`
        @keyframes place-ball {
          0% { transform: translateY(-100px) scale(1); opacity: 1; }
          50% { transform: translateY(20px) scale(1); opacity: 1; }
          100% { transform: translateY(20px) scale(0); opacity: 0; }
        }
      `}</style>
    </Card>
  );
}
