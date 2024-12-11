"use client";

import { useState, useEffect } from "react";

// Tic Tac Toe Board Component
const TicTacToe = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(" "));
  const [currentPlayer, setCurrentPlayer] = useState<string>(""); // Empty before player selects a symbol
  const [winner, setWinner] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [playerSymbol, setPlayerSymbol] = useState<string | null>(null); // Player's symbol ('X' or 'O')
  const [aiSymbol, setAiSymbol] = useState<string>(""); // AI's symbol (opposite of player)
  const [boardVisible, setBoardVisible] = useState<boolean>(true); // Control visibility of the board

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
    const score = evaluate(currentBoard);

    if (score === 10 || score === -10 || checkWinner(currentBoard) === "Tie") {
      return score;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === " ") {
          currentBoard[i] = aiSymbol; // AI plays at position i
          bestScore = Math.max(
            bestScore,
            minimax(currentBoard, depth + 1, false, alpha, beta)
          );
          currentBoard[i] = " ";
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === " ") {
          currentBoard[i] = playerSymbol!; // Player plays at position i
          bestScore = Math.min(
            bestScore,
            minimax(currentBoard, depth + 1, true, alpha, beta)
          );
          currentBoard[i] = " ";
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  };

  const evaluate = (currentBoard: string[]): number => {
    const result = checkWinner(currentBoard);
    if (result === aiSymbol) return 10;
    if (result === playerSymbol) return -10;
    return 0;
  };

  const findBestMove = (): number => {
    const newBoard: string[] = [...board];
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === " ") {
        newBoard[i] = aiSymbol;
        const moveScore = minimax(newBoard, 0, false, -Infinity, Infinity);
        if (moveScore > bestScore) {
          bestScore = moveScore;
          bestMove = i;
        }
        newBoard[i] = " ";
      }
    }

    return bestMove;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] !== " " || !gameActive || currentPlayer !== playerSymbol)
      return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol; // Player's move
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameActive(true);
      setBoardVisible(true); // Hide the board when the game ends
      return;
    }

    setCurrentPlayer(aiSymbol); // Change turn to AI
  };

  const handleAIMove = () => {
    if (gameActive && currentPlayer === aiSymbol) {
      const aiMove = findBestMove();
      const newBoard = [...board];
      newBoard[aiMove] = aiSymbol; // AI's move
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        setGameActive(true);
        setBoardVisible(true); // Hide the board when the game ends
        return;
      }

      setCurrentPlayer(playerSymbol!); // Change turn to player
    }
  };

  useEffect(() => {
    if (gameActive && currentPlayer === aiSymbol) {
      setTimeout(() => handleAIMove(), 500); // AI makes a move after a short delay
    }
  }, [currentPlayer, gameActive]);

  const resetGame = () => {
    setBoard(Array(9).fill(" "));
    setWinner(null);
    setGameActive(false);
    setCurrentPlayer(""); // Reset currentPlayer until symbol is chosen
    setBoardVisible(true); // Show the board again
    setPlayerSymbol(null); // Reset player symbol to allow selection again
  };

  const startNewGame = (chosenSymbol: string) => {
    const aiChosenSymbol = chosenSymbol === "X" ? "O" : "X";
    setPlayerSymbol(chosenSymbol);
    setAiSymbol(aiChosenSymbol);
    setGameActive(true);
    setCurrentPlayer(chosenSymbol); // Player starts first
    setBoardVisible(true); // Make sure the board is visible when the game starts
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
          Tic Tac Toe
        </h1>

        {/* Symbol Selection Prompt */}
        {!gameActive && !playerSymbol && (
          <div className="text-center mb-4">
            <h2 className="text-xl">Choose your symbol</h2>
            <div>
              <button
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                onClick={() => startNewGame("X")}
              >
                X
              </button>
              <button
                className="ml-4 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                onClick={() => startNewGame("O")}
              >
                O
              </button>
            </div>
          </div>
        )}

        {/* Game board */}
        {boardVisible && gameActive && (
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
        )}

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
