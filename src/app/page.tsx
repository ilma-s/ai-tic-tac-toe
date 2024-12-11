"use client";

import { useState, useEffect } from "react";

// Tic Tac Toe Board Component
const TicTacToe = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(" "));
  const [currentPlayer, setCurrentPlayer] = useState<string>("O");
  const [winner, setWinner] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(true);

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  // Check if there's a winner or a draw
  const checkWinner = (currentBoard: string[]): string | null => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] !== " " &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[b] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return currentBoard.includes(" ") ? null : "Tie";
  };

  // Minimax Algorithm with Alpha-Beta Pruning
  const minimax = (
    currentBoard: string[], // Current state of the board
    depth: number, // Current depth of the recursion (how many moves ahead)
    isMaximizing: boolean, // Boolean indicating if the current turn is for maximizing (AI) or minimizing (Player)
    alpha: number, // Best score for the maximizing player (AI)
    beta: number // Best score for the minimizing player (Player)
  ): number => {
    // Evaluate the board for a win/loss/tie condition
    const score = evaluate(currentBoard);

    // If a terminal state is reached (win or tie), return the score
    if (score === 10 || score === -10 || checkWinner(currentBoard) === "Tie") {
      return score;
    }

    if (isMaximizing) {
      // Maximizing player's turn (AI, playing 'X')
      let bestScore = -Infinity; // Start with the worst possible score
      for (let i = 0; i < currentBoard.length; i++) {
        // Iterate over all possible empty spots on the board
        if (currentBoard[i] === " ") {
          currentBoard[i] = "X"; // AI plays at position i
          // Recursively call minimax to simulate the next move
          bestScore = Math.max(
            bestScore,
            minimax(currentBoard, depth + 1, false, alpha, beta)
          );
          currentBoard[i] = " "; // Undo the move
          alpha = Math.max(alpha, bestScore); // Update alpha (best score for maximizing player)
          // Alpha-Beta pruning: if the score is worse than the minimizing player’s best move, stop further exploration
          if (beta <= alpha) {
            break;
          }
        }
      }
      return bestScore;
    } else {
      // Minimizing player's turn (Player, playing 'O')
      let bestScore = Infinity; // Start with the best possible score
      for (let i = 0; i < currentBoard.length; i++) {
        // Iterate over all possible empty spots on the board
        if (currentBoard[i] === " ") {
          currentBoard[i] = "O"; // Player plays at position i
          // Recursively call minimax to simulate the next move
          bestScore = Math.min(
            bestScore,
            minimax(currentBoard, depth + 1, true, alpha, beta)
          );
          currentBoard[i] = " "; // Undo the move
          beta = Math.min(beta, bestScore); // Update beta (best score for minimizing player)
          // Alpha-Beta pruning: if the score is better than the maximizing player’s best move, stop further exploration
          if (beta <= alpha) {
            break;
          }
        }
      }
      return bestScore;
    }
  };

  // Evaluate the board to check if it's a winning board
  const evaluate = (currentBoard: string[]): number => {
    const result = checkWinner(currentBoard);
    if (result === "X") return 10;
    if (result === "O") return -10;
    return 0;
  };

  // Find the best move for the AI
  const findBestMove = (): number => {
    const newBoard: string[] = [...board]; // Ensure newBoard is a string array
    let bestScore = -Infinity;
    let bestMove = -1;

    // Step 1: Check if AI can win immediately
    const win = winningMove(board); // Check for winning move for AI ('X')
    if (win !== null) {
      return win; // AI makes the winning move
    }

    // Step 2: Check if AI needs to block
    const block = blockMove(board); // Check if the player ('O') is about to win
    if (block !== null) {
      return block; // Block the player's winning move
    }

    // Step 3: If no block or winning move is needed, calculate the best move using minimax
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === " ") {
        newBoard[i] = "X"; // AI plays 'X'
        const moveScore = minimax(newBoard, 0, false, -Infinity, Infinity); // Pass all 5 arguments
        if (moveScore > bestScore) {
          bestScore = moveScore;
          bestMove = i;
        }
        newBoard[i] = " "; // Undo the move
      }
    }

    return bestMove;
  };

  // Check for a winning move for 'X' (AI)
  const winningMove = (currentBoard: string[]): number | null => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winConditions) {
      if (
        currentBoard[a] === "X" &&
        currentBoard[b] === "X" &&
        currentBoard[c] === " "
      ) {
        return c;
      }
      if (
        currentBoard[a] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[b] === " "
      ) {
        return b;
      }
      if (
        currentBoard[b] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[a] === " "
      ) {
        return a;
      }
    }

    return null; // No immediate winning move
  };

  // Check for a blocking move for 'O' (Player)
  const blockMove = (currentBoard: string[]): number | null => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winConditions) {
      if (
        currentBoard[a] === "O" &&
        currentBoard[b] === "O" &&
        currentBoard[c] === " "
      ) {
        return c;
      }
      if (
        currentBoard[a] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[b] === " "
      ) {
        return b;
      }
      if (
        currentBoard[b] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[a] === " "
      ) {
        return a;
      }
    }

    return null; // No immediate blocking move
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] !== " " || !gameActive || currentPlayer !== "O") return;

    const newBoard = [...board];
    newBoard[index] = "O"; // Player's move
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameActive(false);
      return;
    }

    setCurrentPlayer("X");
  };

  const handleAIMove = () => {
    if (gameActive && currentPlayer === "X") {
      const aiMove = findBestMove();
      const newBoard = [...board];
      newBoard[aiMove] = "X"; // AI's move
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        setGameActive(false);
        return;
      }

      setCurrentPlayer("O");
    }
  };

  useEffect(() => {
    if (gameActive && currentPlayer === "X") {
      setTimeout(() => handleAIMove(), 500); // AI makes a move after a short delay
    }
  }, [currentPlayer, gameActive]);

  const resetGame = () => {
    setBoard(Array(9).fill(" "));
    setWinner(null);
    setGameActive(true);
    setCurrentPlayer("O"); // Player starts first
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
          Tic Tac Toe
        </h1>
        <div className="w-24 w-full items-center grid grid-cols-3 gap-8 bg-gray-200 p-4 rounded-lg shadow-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              className="
              w-24 h-24 text-3xl font-bold text-gray-800 bg-white border-2 border-gray-400 
              rounded-lg transition transform hover:scale-105 active:scale-95 
              disabled:opacity-50 flex justify-center items-center"
              onClick={() => handlePlayerMove(index)}
              disabled={!gameActive || cell !== " " || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Overlay for the winner or a tie */}
        {winner && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {winner === "Tie" ? "It's a Draw!" : `${winner} Wins!`}
              </h2>
              <button
                className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                onClick={resetGame}
              >
                Restart Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <TicTacToe />
    </div>
  );
}
