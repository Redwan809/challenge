
"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Confetti from 'react-confetti';
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
  
  const [ballBoxId, setBallBoxId] = useState(1); 

  const [boxOrder, setBoxOrder] = useState<number[]>(Array.from({ length: BOX_COUNT }, (_, i) => i));
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; icon: React.ReactNode }>({ text: 'Click Start to Play!', icon: <PartyPopper className="text-accent-foreground" /> });
  const [isAnimatingBall, setIsAnimatingBall] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const boxPositions = useMemo(() => {
    const positions: { [key: number]: number } = {};
    boxOrder.forEach((id, index) => {
      positions[id] = (index - Math.floor(BOX_COUNT / 2)) * 110; 
    });
    return positions;
  }, [boxOrder]);

  const handleShuffle = useCallback(() => {
    setStatus('shuffling');
    setMessage({ text: 'Shuffling...', icon: null });
    
    let promise = Promise.resolve();
    let currentOrder = Array.from({ length: BOX_COUNT }, (_, i) => i);

    for (let i = 0; i < SHUFFLE_COUNT; i++) {
        promise = promise.then(() => new Promise(resolve => {
            setTimeout(() => {
                currentOrder.sort(() => Math.random() - 0.5);
                setBoxOrder([...currentOrder]);
                resolve();
            }, SHUFFLE_SPEED_MS);
        }));
    }

    promise.then(() => {
        setTimeout(() => {
            setStatus('selecting');
            setMessage({ text: 'Where is the ball? Select a box!', icon: null });
        }, SHUFFLE_SPEED_MS);
    });
  }, []);


  const handleStart = () => {
    setShowConfetti(false);
    setSelectedBox(null);
    const newBallBoxId = Math.floor(Math.random() * BOX_COUNT);
    setBallBoxId(newBallBoxId);
    setBoxOrder(Array.from({ length: BOX_COUNT }, (_, i) => i));

    setStatus('placing');
    setMessage({ text: 'Watch the ball!', icon: null });
    setIsAnimatingBall(true);

    setTimeout(() => {
      setIsAnimatingBall(false);
      handleShuffle();
    }, 1500);
  };

  const handleSelectBox = (boxId: number) => {
    if (status !== 'selecting') return;
    
    setSelectedBox(boxId);
    setStatus('revealed');
    
    const correct = boxId === ballBoxId;

    if (correct) {
      setScore(prev => prev + 1);
      setMessage({ text: "You found it! 🎉", icon: <PartyPopper className="text-green-500" /> });
      setShowConfetti(true);
    } else {
      setMessage({ text: "Better luck next time!", icon: <XCircle className="text-red-500" /> });
    }
  };

  const getFloatDelay = (id: number) => {
    return `${(id * 0.2)}s`;
  }

  return (
    <>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
            <h3 className="font-bold text-lg order-2 sm:order-1">Score: <span className="text-primary font-headline text-2xl">{score}</span></h3>
            <div className="text-center min-h-[2.5rem] flex items-center justify-center font-bold text-base sm:text-lg animate-bounce-in order-1 sm:order-2">
              {message.icon}
              <span className="ml-2">{message.text}</span>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-48 sm:h-56 w-full mb-6 sm:mb-8">
            {Array.from({ length: BOX_COUNT }, (_, id) => (
              <div
                key={id}
                className="absolute transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(${boxPositions[id]}%)`,
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: getFloatDelay(id),
                }}
              >
                <GiftBox
                  hasBall={id === ballBoxId}
                  isRevealed={status === 'revealed'}
                  isSelected={selectedBox === id}
                  onClick={() => handleSelectBox(id)}
                  isDisabled={status !== 'selecting'}
                />
              </div>
            ))}

            {(status === 'placing' && isAnimatingBall) && (
               <div className="absolute bottom-1/2 z-20" style={{ 
                  animation: 'place-ball 1.5s ease-in-out forwards',
                  transform: `translateX(${(boxOrder.indexOf(ballBoxId) - Math.floor(BOX_COUNT / 2)) * 100}%)`
                }}>
                  <BallIcon className="w-6 h-6 sm:w-8 sm:h-8"/>
               </div>
            )}
          </div>

          <div className="flex justify-center">
            {status === 'initial' || status === 'revealed' ? (
              <Button
                size="lg"
                onClick={handleStart}
                className="font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform"
              >
                {status === 'initial' ? 'Start Game' : 'Play Again'}
                {status === 'initial' ? <ArrowRight className="ml-2" /> : <RefreshCw className="ml-2" />}
              </Button>
            ) : (
              <Button size="lg" disabled className="font-bold text-lg sm:text-xl">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                {status === 'placing' ? 'Placing Ball...' : 'Shuffling...'}
              </Button>
            )}
          </div>
        </CardContent>
         <style jsx>{`
          @keyframes place-ball {
            0% { transform: translate(0, -100px) scale(1.2); opacity: 1; }
            50% { transform: translate(0, 24px) scale(1); opacity: 1; }
            100% { transform: translate(0, 24px) scale(0); opacity: 0; }
          }
          @media (min-width: 640px) {
            @keyframes place-ball {
              0% { transform: translate(0, -120px) scale(1.2); opacity: 1; }
              50% { transform: translate(0, 30px) scale(1); opacity: 1; }
              100% { transform: translate(0, 30px) scale(0); opacity: 0; }
            }
          }
        `}</style>
      </Card>
    </>
  );
}
