import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = props =>
	<button
		className="square"
		onClick = {props.onClick}
		style = {
			props.winning?
				{fontWeight: "bold"}
				: {}
		}
	>
		{props.value}
	</button>;

function TreeOf (props) {
	return [0, 1, 2].map(i => props.builder(i));
}

function BoardLine (props) {
	const {line, board} = props;
	
	return <div className="board-row">
		<TreeOf builder={x =>
			<Square
				key={x}
				value={board.squares[line][x]}
				onClick={() => board.onClick(x, line)}
				winning={board.winner?.some(i => Math.floor(i/3)===line && i%3===x)}
			/>
		}/>
	</div>;
}

function Board (props) {
	return <TreeOf builder={i =>
		<BoardLine line={i} board={props} key={i} />
	}/>;
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
			reverseHistory: false,
		};
	}
	
	empty () {
		return Array(3).fill(null).map(() => Array(3).fill(null));
	}
	
	get nextPlayer () { return this.current.xIsNext? 'X' : 'O' };
	get winner () { return calculateWinner(this.current.squares)?.winner };
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
		const history = [...this.state.history];
		if (this.state.reverseHistory)
			history.reverse();
		
		return history.map((entry, index) => {
			if (this.state.reverseHistory)
				index = history.length -1 - index;
			return <li key={index}>
				<button
					onClick={() => this.timeTravel(index)}
					style={
						this.state.moveNumber === index ?
							{fontWeight: "bold"}
							: {}
					}
				> {
					index === 0 ?
						"Go to start"
						: `Go to move #${index} (${entry.move.x}, ${entry.move.y})`
				} </button>
			</li>
		});
	}
	
	render () {
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares = {this.current.squares}
						onClick = { (x, y) => this.handleSquareClick(x, y) }
						winner = {calculateWinner(this.current.squares)?.squares}
					/>
				</div>
				<div className="game-info">
					{this.status}
					<br /> <br />
					<button onClick={() => this.setState({
						...this.state,
						reverseHistory: !this.state.reverseHistory,
					})}>
						Reverse History order
					</button>
					<ol>{this.moves}</ol>
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
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i].map(i => squares[Math.floor(i/3)][i%3]);
		if (a && a === b && a === c) {
			return {
				winner: a,
				squares: lines[i],
			};
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
