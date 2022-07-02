/*************** WILL CONATIN THE GAME'S LOGIC *********************/
import Board from './Board2';	// Board GUI
import Piece from './Piece2';	// Piece GUI
import { renderer, scene, camera,  control, COLORS, player1Color, player2Color } from './constants';	// Import the basic utilities

export default class Game {
	constructor() {
		/*
			WE STORE THE POSITIONS ON THE BOARD IN A SINGLE ARRAY AND CHANGE IT ACCORDING TO MULTIPLE MOVES
			
			-- STORAGE TECHINQUE DESCRIPTION --
			In an array, to store a 5*9 matrix, we can use the following correspondance:
			let i be the line in the matrix and j be the column
			pos: the index in the corresponding array would be given by the formula
			=> arrayPos= i * col + j where col is the number of column (here 9)
			THIS IS TO MARK THE POSITION OF THE PIECE IN THE MOVE ARRAY
		*/
		this.game= [];	// Will contain the logic
		this.board= new Board(scene);	// The game board to the global scene

		/************************ PLACING THE PIECES ON THE BOARD WITH DEFAULT DISPOSITION ******************************************/
		let piece;
		// Player 2 pieces
		this.defaultPlayer2Pieces();
		// The middle line (right side)
		this.defaultMiddlePieces();
		// Player 1 pieces
		this.defaultPlayer1Pieces();
		/************************************************** END OF PIECE PLACING **********************************************/
	}	// End of constructor

	getGameMatrix() {
		// Getter for the game matrix representing the pieces values per indexes
		let matrix= [];
		let lign= [];	// Initialization
		for (let i= 0; i < 5*9; i++) {
			lign.push(this.game[i] != 0? this.game[i].value: 0);	// Get the values in each position
			if (lign.length == 9) {
				// First column
				matrix.push(lign);
				lign= [];
			}
		}
		return matrix;
	}

	defaultPlayer1Pieces() {
		// Place the default player 1 pieces
		let piece;
		for (let i= 3; i < 5; i++) {	// The first 2 lines: value is 1
			for (let j= 0; j < 9; j++) {	// By column
				piece= new Piece(1, i * 9 + j);	// Piece(value, index) adding the pieces on the board
				// Place it on the board
				this.board.place(piece);
				this.game.push(piece);	// The main array store the pieces to be manipulated in the logics
			}
		}
	}

	defaultPlayer2Pieces() {
		// Place the default player 2 pieces
		let piece;
		for (let i= 0; i < 2; i++) {	// The first 2 lines: value is 1
			for (let j= 0; j < 9; j++) {	// By column
				piece= new Piece(-1, i * 9 + j);	// Piece(value, index) adding the pieces on the board
				// Place it on the board
				this.board.place(piece);
				this.game.push(piece);	// The main array store the pieces to be manipulated in the logics
			}
		}
	}

	defaultMiddlePieces() {
		// Place the pieces in the middle of the board
		let piece;
		// The middle line (left side)
		for (let i= 0; i < 4; i++) {
			piece= new Piece(i % 2? 1: -1, 2 * 9 + i);	// Piece(value, index) adding the pieces on the board
			// Place it on the board
			this.board.place(piece);
			this.game.push(piece);	// The main array store the pieces to be manipulated in the logics
		}
		// The middle point
		this.game.push(0);
		// The middle line (right side)
		for (let i= 5; i < 9; i++) {
			piece= new Piece(i % 2? -1: 1, 2 * 9 + i);	// Piece(value, index) adding the pieces on the board
			// Place it on the board
			this.board.place(piece);
			this.game.push(piece);	// The main array store the pieces to be manipulated in the logics
		}
	}

	checkForWinner() {
		// Check if there is a winner
		let nPlayer1= 0, nPlayer2= 0;	// Number of pieces for player 1 and 2
		for (let elt of this.game) {
			if (nPlayer1 * nPlayer2) {
				// No winner yet
				return 0;
			}
			if (elt != 0) {
				// If we have a piece
				if (elt.value == 1) {
					// Player 1 piece
					nPlayer1++;
				}
				else {
					// Player 2 piece
					nPlayer2++;
				}
			}	// End if for piece selection
		}	// End for
		return nPlayer1? 1: -1;	// 1 if player 1 is winning and -1 if player 2 is winning
	}
}