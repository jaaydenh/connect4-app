import React, { useState, useLayoutEffect } from 'react';

import './App.css';

const ROWS = 6;
const COLS = 7;

const Square = ({
  row,
  col,
  player,
  handleMove,
}: {
  row: number;
  col: number;
  player: number;
  handleMove: (col: number) => void;
}) => {
  const color = player === 0 ? 'white' : player === 1 ? 'blue' : 'red';

  return (
    <span>
      [
      <span
        onClick={() => handleMove(col)}
        key={`${row}-${col}`}
        className={`cell ${color}`}
      >
        O
      </span>
      ]
    </span>
  );
};

const Board = ({
  board,
  handleMove,
}: {
  board: cell[];
  handleMove: (col: number) => void;
}) => {
  return (
    <>
      {board.map((cell, index) => {
        // console.log('col: ' + (index % 7) + ' row: ' + Math.floor(index / 7));
        return (
          <>
            {index % COLS === 0 && <br />}
            <Square
              key={index}
              player={cell.value}
              col={index % 7}
              row={index / 7}
              handleMove={handleMove}
            />
          </>
        );
      })}
    </>
  );
};

type cell = {
  value: number;
};

const findMoveIndex = (col: number, board: Array<cell>) => {
  let row = ROWS - 1;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[col + row * COLS].value === 0) {
      return col + row * COLS;
    }
  }
  return null;
};

const getRowForMove = (col: number, moveIndex: number) => {
  const row = Math.floor((moveIndex - col) / COLS);
  return row;
};

const checkWinnerRow = (row: number, player: number, board: Array<cell>) => {
  let connected = 0;
  for (let col = 0; col < COLS; col++) {
    // console.log(board[col + row * COLS].value);
    if (board[col + row * COLS].value === player) {
      connected++;
      if (connected >= 4) return true;
    } else {
      connected = 0;
    }
  }

  return false;
};

const checkWinnerColumn = (col: number, player: number, board: Array<cell>) => {
  let connected = 0;
  for (let row = 0; row < ROWS; row++) {
    if (board[col + row * COLS].value === player) {
      connected++;
      if (connected >= 4) return true;
    } else {
      connected = 0;
    }
  }

  return false;
};

const checkForWinner = (
  player: number,
  row: number,
  col: number,
  board: Array<cell>
) => {
  return (
    checkWinnerRow(row, player, board) || checkWinnerColumn(col, player, board)
  );
};

function App() {
  const [board, setBoard] = useState<Array<cell>>(
    Array(ROWS * COLS).fill({ value: 0 })
  );
  const [playerTurn, setPlayerTurn] = useState(1);
  const [lastMove, setLastMove] = useState({ row: 0, col: 0 });

  const isWin = checkForWinner(
    playerTurn === 1 ? 2 : 1,
    lastMove.row,
    lastMove.col,
    board
  );

  let gameStatusText = '';
  if (isWin) {
    gameStatusText = `Player ${playerTurn} Won!!!`;
  } else {
    gameStatusText = `Player ${playerTurn}'s Turn`;
  }

  const handleMove = (col: number) => {
    if (isWin) return;

    if (board[col].value !== 0) {
      alert(`Column ${col} is full`);
    } else {
      const moveIndex = findMoveIndex(col, board);
      if (!moveIndex) throw Error(`Move at ${col} is invalid`);
      const updatedSquare = { ...board[moveIndex], value: playerTurn };
      const newBoard = [...board];
      newBoard[moveIndex] = updatedSquare;

      setBoard(newBoard);
      setLastMove({ row: getRowForMove(col, moveIndex), col: col });
      setPlayerTurn((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
    }
  };

  return (
    <>
      <div>{gameStatusText}</div>
      <Board board={board} handleMove={handleMove} />
    </>
  );
}

export default App;
