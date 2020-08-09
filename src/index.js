import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = props =>
	<button
		className="square"
		onClick = {props.onClick}
	>
		{props.value}
	</button>;

function Board (props) {
	const renderSquare = (x, y) =>
		<Square
			value={props.squares[y][x]}
			onClick={() => props.onClick(x, y)}
		/>;
	
	return (
		<div>
			<div className="board-row">
				{renderSquare(0, 0)}
				{renderSquare(1, 0)}
				{renderSquare(2, 0)}
			</div>
			<div className="board-row">
				{renderSquare(0, 1)}
				{renderSquare(1, 1)}
				{renderSquare(2, 1)}
			</div>
			<div className="board-row">
				{renderSquare(0, 2)}
				{renderSquare(1, 2)}
				{renderSquare(2, 2)}
			</div>
		</div>
	);
}

class Game extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			history: [
				{
					squares: this.empty(),
					xIsNext: true,
				},
			],
			moveNumber: 0,
		};
	}
	
	empty () {
		return Array(3).fill(null).map(() => Array(3).fill(null));
	}
	
	get nextPlayer () { return this.current.xIsNext? 'X' : 'O' };
	get winner () { return calculateWinner(this.current.squares) };
	get catsGame () {
		for (let i=0; i<3; i++)
			for (let j=0; j<3; j++)
				if (this.current.squares[i][j] === null)
					return false;
		return true;
	}
	get current () {
		return this.state.history[this.state.moveNumber];
	}
	
	handleSquareClick (x, y) {
		if (this.winner || this.current.squares[y][x])
			return;
		
		const squares = JSON.parse(JSON.stringify(this.current.squares));
		squares[y][x] = this.nextPlayer;
		this.setState({
			history: [...this.state.history.slice(0, this.state.moveNumber+1), {
				squares,
				xIsNext: !this.current.xIsNext,
				move: {x: x+1, y: y+1},
			}],
			moveNumber: this.state.moveNumber + 1,
		});
	}
	timeTravel (i) {
		this.setState({
			...this.state,
			moveNumber: i,
		});
	}
	
	get status () {
		return this.winner?
			'Winner: ' + this.winner
			: this.catsGame?
				"Cat's game."
				: 'Next player: ' + this.nextPlayer;
	}
	get moves () {
		return this.state.history.map((entry, index) =>
			<li key={index}>
				<button
					onClick = { () => this.timeTravel(index) }
					style = {
						this.state.moveNumber===index?
							{fontWeight: "bold"}
							: {}
					}
				> {
					index === 0?
						"Go to start"
						: "Go to move #" + index + " (" + entry.move.x + ", " + entry.move.y + ")"
				} </button>
			</li>
		);
	}
	
	render () {
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.current.squares}
						onClick={(x, y) => this.handleSquareClick(x, y)}
					/>
				</div>
				<div className="game-info">
					<div>{this.status}</div>
					<ol>{this.moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner (squares) {
	for (let i=0; i<3; i++) {
		if (squares[0][i] && squares[0][i] === squares[1][i] && squares[0][i] === squares[2][i]) {
			return squares[0][i];
		}
	}
	for (let i=0; i<3; i++) {
		if (squares[i][0] && squares[i][0] === squares[i][1] && squares[i][0] === squares[i][2]) {
			return squares[i][0];
		}
	}
	if (squares[1][1] &&
		((squares[1][1] === squares[0][0] && squares[1][1] === squares[2][2]) ||
		(squares[1][1] === squares[0][2] && squares[1][1] === squares[2][0]))
	)
		return squares[1][1];
	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
