
"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { GiftBox } from '@/components/game/gift-box';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, PartyPopper, RefreshCw, XCircle, Trophy } from 'lucide-react';
import { BallIcon } from '@/components/game/ball-icon';

type GameStatus = 'initial' | 'placing' | 'shuffling' | 'selecting' | 'revealed';

const INITIAL_BOX_COUNT = 3;
const MAX_BOX_COUNT = 6;
const SHUFFLE_COUNT = 5;
const INITIAL_SHUFFLE_SPEED_MS = 400;

export default function Game() {
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('initial');
  
  const [ballBoxId, setBallBoxId] = useState(1); 
  const [boxCount, setBoxCount] = useState(INITIAL_BOX_COUNT);

  const [boxOrder, setBoxOrder] = useState<number[]>(Array.from({ length: boxCount }, (_, i) => i));
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; icon: React.ReactNode }>({ text: 'Click Start to Play!', icon: <PartyPopper className="text-accent" /> });
  const [isAnimatingBall, setIsAnimatingBall] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const storedHighScore = localStorage.getItem('mysteryBoxHighScore');
    if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
    }

    const handleResize = () => {
      if(typeof window !== 'undefined'){
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      isMounted.current = false;
    };
  }, []);

  const boxPositions = useMemo(() => {
    const positions: { [key: number]: number } = {};
    const spacing = 110; // Spacing between boxes in percentage
    const totalWidth = (boxCount - 1) * spacing;
    const baseOffset = -totalWidth / 2;

    boxOrder.forEach((id, index) => {
      const initialPositionIndex = boxOrder.indexOf(id);
      positions[id] = baseOffset + (initialPositionIndex * spacing);
    });
    return positions;
  }, [boxOrder, boxCount]);

  const handleShuffle = useCallback(async () => {
    setStatus('shuffling');
    setMessage({ text: 'Shuffling...', icon: null });
    
    let currentOrder = Array.from({ length: boxCount }, (_, i) => i);
    const shuffleSpeed = Math.max(200, INITIAL_SHUFFLE_SPEED_MS - (level * 20));

    for (let i = 0; i < SHUFFLE_COUNT + level; i++) {
        await new Promise(resolve => setTimeout(resolve, shuffleSpeed));
        if (!isMounted.current) return;
        
        // Simple swap logic for animation
        const [idx1, idx2] = [Math.floor(Math.random() * boxCount), Math.floor(Math.random() * boxCount)];
        if (idx1 !== idx2) {
            [currentOrder[idx1], currentOrder[idx2]] = [currentOrder[idx2], currentOrder[idx1]];
            setBoxOrder([...currentOrder]);
        }
    }

    await new Promise(resolve => setTimeout(resolve, shuffleSpeed + 100));
    if (!isMounted.current) return;
    setStatus('selecting');
    setMessage({ text: 'Where is the ball? Select a box!', icon: null });

  }, [level, boxCount]);


  const startNewLevel = (currentLevel: number) => {
    setShowConfetti(false);
    setSelectedBox(null);
    const newBoxCount = Math.min(MAX_BOX_COUNT, INITIAL_BOX_COUNT + currentLevel - 1);
    setBoxCount(newBoxCount);

    const initialOrder = Array.from({ length: newBoxCount }, (_, i) => i);
    setBoxOrder(initialOrder);

    const newBallBoxId = Math.floor(Math.random() * newBoxCount);
    setBallBoxId(newBallBoxId);
    
    setStatus('placing');
    setMessage({ text: `Level ${currentLevel}: Watch the ball!`, icon: null });
    setIsAnimatingBall(true);

    setTimeout(() => {
      if (!isMounted.current) return;
      setIsAnimatingBall(false);
      handleShuffle();
    }, 1500);
  }

  const handleStart = () => {
    setLevel(1);
    startNewLevel(1);
  };
  
  const handleNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    startNewLevel(nextLevel);
  }

  const handleSelectBox = (boxId: number) => {
    if (status !== 'selecting') return;
    
    setSelectedBox(boxId);
    setStatus('revealed');
    
    const correct = boxId === boxOrder.indexOf(ballBoxId);

    if (correct) {
      setMessage({ text: `Correct! Well done! 🎉`, icon: <PartyPopper className="text-primary" /> });
      setShowConfetti(true);
      if (level >= highScore) {
        const newHighScore = level;
        setHighScore(newHighScore);
        localStorage.setItem('mysteryBoxHighScore', newHighScore.toString());
      }
    } else {
      setMessage({ text: "Game Over! Better luck next time.", icon: <XCircle className="text-destructive" /> });
      setLevel(1); // Reset level
    }
  };

  const getFloatDelay = (id: number) => {
    return `${(id * 0.2)}s`;
  }
  
  const isGameOver = status === 'revealed' && selectedBox !== null && selectedBox !== boxOrder.indexOf(ballBoxId);

  return (
    <>
      {showConfetti && windowSize.width > 0 && isMounted.current && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}
      <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
            <div className="flex gap-4 order-2 sm:order-1 text-center">
                <h3 className="font-bold text-lg">Level: <span className="text-primary font-headline text-2xl">{level}</span></h3>
                <h3 className="font-bold text-lg flex items-center gap-1"><Trophy className="text-accent"/> High Score: <span className="text-primary font-headline text-2xl">{highScore}</span></h3>
            </div>
            <div className="text-center min-h-[2.5rem] flex items-center justify-center font-bold text-base sm:text-lg animate-bounce-in order-1 sm:order-2">
              {message.icon}
              <span className="ml-2">{message.text}</span>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-48 sm:h-56 w-full mb-6 sm:mb-8">
            {Array.from({ length: boxCount }, (_, id) => (
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
                  isSelected={id === selectedBox}
                  onClick={() => handleSelectBox(boxOrder.indexOf(id))}
                  isDisabled={status !== 'selecting'}
                />
              </div>
            ))}

            {(status === 'placing' && isAnimatingBall) && (
               <div className="absolute bottom-1/2 z-20" style={{ 
                  animation: 'place-ball 1.5s ease-in-out forwards',
                  transform: `translateX(${boxPositions[ballBoxId]}%)`
                }}>
                  <BallIcon className="w-6 h-6 sm:w-8 sm:h-8"/>
               </div>
            )}
          </div>

          <div className="flex justify-center h-11">
            {status === 'initial' && (
              <Button size="lg" onClick={handleStart} className="font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">
                Start Game <ArrowRight className="ml-2" />
              </Button>
            )}
            {status === 'revealed' && !isGameOver && (
              <Button size="lg" onClick={handleNextLevel} className="font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">
                Next Level <ArrowRight className="ml-2" />
              </Button>
            )}
            {isGameOver && (
              <Button size="lg" onClick={handleStart} className="font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">
                Play Again <RefreshCw className="ml-2" />
              </Button>
            )}
            {(status === 'placing' || status === 'shuffling') && (
              <Button size="lg" disabled className="font-bold text-lg sm:text-xl">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                {status === 'placing' ? 'Placing Ball...' : 'Shuffling...'}
              </Button>
            )}
          </div>
        </CardContent>
         <style jsx>{`
          @keyframes place-ball {
            0% { transform: translate(${boxPositions[ballBoxId]}%, -100px) scale(1.2); opacity: 1; }
            50% { transform: translate(${boxPositions[ballBoxId]}%, 24px) scale(1); opacity: 1; }
            100% { transform: translate(${boxPositions[ballBoxId]}%, 24px) scale(0); opacity: 0; }
          }
          @media (min-width: 640px) {
            @keyframes place-ball {
              0% { transform: translate(${boxPositions[ballBoxId]}%, -120px) scale(1.2); opacity: 1; }
              50% { transform: translate(${boxPositions[ballBoxId]}%, 30px) scale(1); opacity: 1; }
              100% { transform: translate(${boxPositions[ballBoxId]}%, 30px) scale(0); opacity: 0; }
            }
          }
        `}</style>
      </Card>
    </>
  );
}
