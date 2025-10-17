
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Bot, Award, Star, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';

type Player = 'X' | 'O';
type Difficulty = 'easy' | 'medium' | 'hard';
const HUMAN_PLAYER: Player = 'X';
const AI_PLAYER: Player = 'O';

const initialBoard = Array(9).fill(null);

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

const checkWinner = (board: (Player | null)[]) => {
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: winningLines[i] };
    }
  }
  if (!board.includes(null)) {
    return { winner: 'draw', line: [] };
  }
  return null;
};

export default function TicTacToe() {
  const [board, setBoard] = useState<(Player | null)[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER);
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player | 'draw' | null, line: number[] }>({ winner: null, line: [] });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [scores, setScores] = useState({ player: 0, ai: 0, draw: 0 });

  const findBestMove = useCallback((currentBoard: (Player | null)[]) => {
    // AI's turn to win
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const tempBoard = [...currentBoard];
        tempBoard[i] = AI_PLAYER;
        if (checkWinner(tempBoard)?.winner === AI_PLAYER) return i;
      }
    }
    // Block human player from winning
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const tempBoard = [...currentBoard];
        tempBoard[i] = HUMAN_PLAYER;
        if (checkWinner(tempBoard)?.winner === HUMAN_PLAYER) return i;
      }
    }
    // Hard difficulty strategy
    if (difficulty === 'hard') {
        // Take center if available
        if (currentBoard[4] === null) return 4;
        // Take opposite corner
        const corners = [0, 2, 6, 8];
        const oppositeCorners = { 0: 8, 2: 6, 6: 2, 8: 0 };
        for (const corner of corners) {
            if (currentBoard[corner] === HUMAN_PLAYER && currentBoard[oppositeCorners[corner as keyof typeof oppositeCorners]] === null) {
                return oppositeCorners[corner as keyof typeof oppositeCorners];
            }
        }
        // Take empty corner
        const emptyCorners = corners.filter(i => currentBoard[i] === null);
        if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }
    
    // Medium/Easy: random available spot
    const availableSpots = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if(availableSpots.length > 0) {
      return availableSpots[Math.floor(Math.random() * availableSpots.length)] as number;
    }
    return -1;
  }, [difficulty]);


  useEffect(() => {
    const winnerResult = checkWinner(board);
    if (winnerResult) {
      setWinnerInfo({ winner: winnerResult.winner, line: winnerResult.line });
      if (winnerResult.winner === HUMAN_PLAYER) {
        setScores(s => ({ ...s, player: s.player + 1 }));
      } else if (winnerResult.winner === AI_PLAYER) {
        setScores(s => ({ ...s, ai: s.ai + 1 }));
      } else {
        setScores(s => ({ ...s, draw: s.draw + 1 }));
      }
    } else if (currentPlayer === AI_PLAYER) {
      // AI's turn
      const moveDelay = difficulty === 'hard' ? 700 : difficulty === 'medium' ? 500 : 300;
      setTimeout(() => {
        let move;
        if (difficulty === 'easy' && Math.random() > 0.5) {
            const availableSpots = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            move = availableSpots[Math.floor(Math.random() * availableSpots.length)] as number;
        } else {
            move = findBestMove(board);
        }

        if (move !== -1 && move !== undefined) {
          handleSquareClick(move);
        }
      }, moveDelay);
    }
  }, [board, currentPlayer, difficulty, findBestMove]);

  const handleSquareClick = (index: number) => {
    if (winnerInfo.winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER);
  };

  const resetGame = (fullReset = false) => {
    setBoard(initialBoard);
    setCurrentPlayer(HUMAN_PLAYER);
    setWinnerInfo({ winner: null, line: [] });
    if(fullReset) {
      setScores({ player: 0, ai: 0, draw: 0 });
    }
  };

  const getStatusMessage = () => {
    if (winnerInfo.winner) {
      if (winnerInfo.winner === 'draw') return "It's a draw!";
      if (winnerInfo.winner === HUMAN_PLAYER) return "You Win!";
      return "AI Wins!";
    }
    return currentPlayer === HUMAN_PLAYER ? "Your Turn" : "AI is Thinking...";
  };
  
  const getStatusIcon = () => {
      if (winnerInfo.winner) {
        if (winnerInfo.winner === 'draw') return <Minus className="text-gray-500"/>;
        if (winnerInfo.winner === HUMAN_PLAYER) return <Award className="text-yellow-500" />;
        return <Bot className="text-red-500"/>;
      }
      return currentPlayer === HUMAN_PLAYER ? <User /> : <BrainCircuit className="animate-pulse" />;
  }

  const Square = ({ value, index, isWinning }: { value: Player | null, index: number, isWinning: boolean }) => (
    <button
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-muted transition-all duration-300 disabled:cursor-not-allowed",
        "aspect-square w-full h-full",
        "shadow-inner",
        isWinning && "bg-primary/30",
        !value && !winnerInfo.winner && "hover:bg-muted/80"
      )}
      onClick={() => handleSquareClick(index)}
      disabled={!!winnerInfo.winner || !!value || currentPlayer === AI_PLAYER}
    >
      {value && (
        <span className={cn(
          "text-5xl sm:text-7xl font-extrabold animate-bounce-in",
          value === 'X' ? 'text-primary' : 'text-destructive'
        )}>
          {value}
        </span>
      )}
    </button>
  );

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline flex items-center justify-center gap-2">
            <Star className="text-yellow-400"/> Tic-Tac-Toe Pro <Star className="text-yellow-400"/>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex gap-4 font-bold text-sm sm:text-base order-2 sm:order-1 w-full sm:w-auto">
                <p className="flex items-center gap-1"><User /> You: <span className="text-primary">{scores.player}</span></p>
                <p className="flex items-center gap-1"><Bot /> AI: <span className="text-destructive">{scores.ai}</span></p>
                <p>Draw: {scores.draw}</p>
            </div>
             <div className="flex items-center gap-2 order-1 sm:order-2">
                <Label htmlFor="difficulty-select">Difficulty:</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger className="w-[120px]" id="difficulty-select">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="relative mb-6">
            <div className="grid grid-cols-3 gap-2 aspect-square">
                {board.map((value, index) => (
                    <Square key={index} value={value} index={index} isWinning={winnerInfo.line.includes(index)} />
                ))}
            </div>
            {winnerInfo.line.length > 0 && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                    <line 
                        x1={((winnerInfo.line[0] % 3) * 33.3) + 16.6}
                        y1={(Math.floor(winnerInfo.line[0] / 3) * 33.3) + 16.6}
                        x2={((winnerInfo.line[2] % 3) * 33.3) + 16.6}
                        y2={(Math.floor(winnerInfo.line[2] / 3) * 33.3) + 16.6}
                        className="stroke-yellow-400"
                        strokeWidth="5"
                        strokeLinecap="round"
                        style={{animation: "draw-line 1s ease-out forwards", strokeDasharray: 1000}}
                    />
                </svg>
            )}
        </div>
        
        <div className="text-center text-xl font-bold mb-4 min-h-[28px] flex items-center justify-center gap-2">
          {getStatusIcon()}
          <span>{getStatusMessage()}</span>
        </div>

        <div className="flex gap-2">
            <Button onClick={() => resetGame(false)} size="lg" className="w-full font-bold" variant="secondary" disabled={!winnerInfo.winner && board.every(s => s === null)}>
              <RefreshCw className="mr-2 h-4 w-4" /> 
              {winnerInfo.winner ? 'Play Again' : 'Restart'}
            </Button>
            <Button onClick={() => resetGame(true)} size="lg" className="w-full font-bold">
              Reset All
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

    