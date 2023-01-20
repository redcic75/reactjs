import React from 'react';
// import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';

function Square(props) {
  const classes = props.isWinner ? 'square highlighted': 'square';
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(row, col) {
    const index = 3 * row + col;
    const isWinnerSquare = this.props.winningSquares.includes(index);
    return (
      <Square
        key={col}
        isWinner={isWinnerSquare}
        value={this.props.squares[index]}
        onClick={() => this.props.onClick(index)}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3).keys()].map(row =>
          <div key={row} className="board-row">
            {[...Array(3).keys()].map(col => this.renderSquare(row, col))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveLocation: [null, null],
        winningSquares: Array(3).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || calculateWinner(squares)?.winner) {
      // square already taken by a player
      // OR player already won before this move
      return;
    }

    // Calculate new history
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const newHistory = history.concat([{
      squares: squares,
      moveLocation: [(i % 3) + 1, Math.ceil((i + 1) / 3)],
      winningSquares: calculateWinner(squares)?.winningSquares,
    }]);


    this.setState({
      history: newHistory,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
     });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)?.winner;

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move ${move}` : `Go to game start`;
      const moveLocation = history[move].moveLocation;
      const moveLocationStr = move ? `(${moveLocation[0]},${moveLocation[1]})` : '';
      return (
        <li key={move} className={(move === this.state.stepNumber) ? 'bold' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <p>{moveLocationStr}</p>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={current.winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i],
      };
    }
  }
  return {
    winner: null,
    winningSquares: Array(3).fill(null),
  };
}

// ========================================

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<Game />);
