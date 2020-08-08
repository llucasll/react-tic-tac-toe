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
	const renderSquare = i =>
		<Square
			value={props.squares[i]}
			onClick={() => props.onClick(i)}
		/>;
	
	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	);
}

class Game extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			history: [
				{squares: Array(9).fill(null)},
			],
			xIsNext: true,
		};
	}
	
	get nextPlayer () { return this.state.xIsNext? 'X' : 'O' };
	get winner () { return calculateWinner(this.current.squares) };
	get status () {
		return this.winner?
			'Winner: ' + this.winner
			: 'Next player: ' + this.nextPlayer;
	}
	get current () {
		const history = this.state.history;
		return history[history.length - 1];
	}
	
	handleSquareClick (i) {
		if (this.winner || this.current.squares[i])
			return;
		
		const squares = [...this.current.squares];
		squares[i] = this.nextPlayer;
		this.setState({
			history: [...this.state.history, {squares}],
			xIsNext: !this.state.xIsNext,
		});
	}
	
	render () {
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.current.squares}
						onClick={i => this.handleSquareClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{this.status}</div>
					<ol>{/* TODO */}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner (squares) {
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
	for (let i=0; i<lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
