import React, { useState, useEffect } from 'react';

const styles = {
  game: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px'
  },
  status: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    width: '100%'
  },
  square: {
    background: '#fff',
    border: '2px solid #333',
    fontSize: '32px',
    fontWeight: 'bold',
    height: '80px',
    padding: '0',
    textAlign: 'center',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  resetButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getEmptySquares = (squares) => {
    return squares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
  };

  const minimax = (squares, depth, isMaximizing) => {
    const winner = calculateWinner(squares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (getEmptySquares(squares).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      getEmptySquares(squares).forEach(move => {
        squares[move] = 'O';
        const score = minimax(squares, depth + 1, false);
        squares[move] = null;
        bestScore = Math.max(score, bestScore);
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      getEmptySquares(squares).forEach(move => {
        squares[move] = 'X';
        const score = minimax(squares, depth + 1, true);
        squares[move] = null;
        bestScore = Math.min(score, bestScore);
      });
      return bestScore;
    }
  };

  const getBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove = null;
    
    getEmptySquares(squares).forEach(move => {
      squares[move] = 'O';
      const score = minimax(squares, 0, false);
      squares[move] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });
    
    return bestMove;
  };

  const handleClick = (i) => {
    if (!isHumanTurn || board[i] || calculateWinner(board) || gameOver) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsHumanTurn(false);
  };

  useEffect(() => {
    if (!isHumanTurn && !gameOver) {
      // Add a small delay to make AI moves feel more natural
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const bestMove = getBestMove(newBoard);
        
        if (bestMove !== null) {
          newBoard[bestMove] = 'O';
          setBoard(newBoard);
        }
        
        setIsHumanTurn(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, board, gameOver]);

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner || getEmptySquares(board).length === 0) {
      setGameOver(true);
    }
  }, [board]);

  const winner = calculateWinner(board);
  const isDraw = !winner && getEmptySquares(board).length === 0;
  
  const getStatus = () => {
    if (winner) return `Winner: ${winner}!`;
    if (isDraw) return 'Game Draw!';
    return isHumanTurn ? 'Your turn (X)' : 'AI thinking...';
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsHumanTurn(true);
    setGameOver(false);
  };

  const squareStyle = (value) => ({
    ...styles.square,
    color: value === 'X' ? '#ff4081' : '#2196f3',
    cursor: (!isHumanTurn || value || gameOver) ? 'default' : 'pointer',
    backgroundColor: value || !isHumanTurn ? '#fff' : '#f8f8f8'
  });

  return (
    <div style={styles.game}>
      <div style={styles.status}>{getStatus()}</div>
      <div style={styles.board}>
        {board.map((square, i) => (
          <button
            key={i}
            style={squareStyle(square)}
            onClick={() => handleClick(i)}
            disabled={!isHumanTurn || !!square || gameOver}
          >
            {square}
          </button>
        ))}
      </div>
      <button 
        style={styles.resetButton}
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
