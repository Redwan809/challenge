
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Player = 'X' | 'O';
const initialBoard = Array(9).fill(null);

export default function TicTacToe() {
  const [board, setBoard] = useState<(Player | null)[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  useEffect(() => {
    const checkWinner = () => {
      const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];

      for (let line of winningLines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    };

    const winnerFound = checkWinner();
    if (winnerFound) {
      setWinner(winnerFound);
    } else if (!board.includes(null)) {
      setWinner('draw');
    }
  }, [board]);

  const handleSquareClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setWinner(null);
  };

  const getStatusMessage = () => {
    if (winner) {
      return winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`;
    }
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <Card className="w-full max-w-xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline">Tic-Tac-Toe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-6 aspect-square">
          {board.map((value, index) => (
            <button
              key={index}
              className={cn(
                "flex items-center justify-center text-4xl sm:text-6xl font-bold rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:cursor-not-allowed",
                value === 'X' ? 'text-primary' : 'text-destructive'
              )}
              onClick={() => handleSquareClick(index)}
              disabled={!!winner || !!value}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="text-center text-xl font-bold mb-4 min-h-[28px]">
          {getStatusMessage()}
        </div>

        <Button onClick={resetGame} size="lg" className="w-full font-bold">
          <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
        </Button>
      </CardContent>
    </Card>
  );
}
