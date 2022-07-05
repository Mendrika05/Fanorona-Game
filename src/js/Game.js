/*************** WILL CONATIN THE GAME'S LOGIC *********************/
import Board from './Board2';	// Board GUI
import Piece from './Piece2';	// Piece GUI
import { renderer, scene, camera } from './constants';	// Import the camera to allow view swapping
import { up, down, left, right, upperLeft, upperRight, lowerLeft, lowerRight, Mover } from './moves';

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
		this.actual= undefined;	// The selected piece
		this.displacement= 0;	// The displacement of the actual piece
		this.moveSequence= [];	// To store the move sequence
		this.movablePieces= [];	// To store the piece that can move for this turn
		this.choices= [];	// The choices array in case of capture conflict
		this.board= new Board(scene);	// The game board to the global scene

		/************************ PLACING THE PIECES ON THE BOARD WITH DEFAULT DISPOSITION ******************************************/
		let piece;
		// Player 2 pieces
		this.defaultPlayer2Pieces();
		// The middle line (right side)
		this.defaultMiddlePieces();
		// Player 1 pieces
		this.defaultPlayer1Pieces();

		// Initialize the moves
		this.turn= 1;	// The initial turn
		this.processAllMoves();
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

	/***************************** GAME MANAGEMENT ****************************************/
	winnerExists() {
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
	swapTurn() {
		// Swap turn
		this.actual.default();	// Return to default
		this.actual= undefined;	// Set actual piece to undefined
		this.displacement= 0;	// Reset displacement
		this.moveSequence= [];	// Reset move sequence
		// Reset the colors of the pieces
		if (this.movablePieces.length > 0) {
			this.movablePieces.forEach((piece) => {
				piece.default();
			});
		}
		if (!this.winnerExists()) {
			// If there is no winner yet
			this.turn*= -1;	// Swap turn
			this.processAllMoves();	// Process all moves for the Player having the turn
			this.swapView()// Turn the camera
		}	// End if no winner yet
		else {
			alert("Player " + (this.turn == 1? "1": "2") + " won the game");
		}
	}
	swapView() {
		// Swap the camera's view
		if (parseInt(camera.position.z) != parseInt(this.turn * 2)) {
			requestAnimationFrame(this.swapView.bind(this));	// Recall the method for the animation
			camera.position.x= camera.position.z * this.turn > 0? 0.2: 0.5;
			camera.position.y= 5;
			camera.position.z+= this.turn < 0? -0.1: 0.1;
			camera.updateProjectionMatrix();	// When changing the thing we need to set this
			renderer.render(scene, camera);
			// control.update();	// Update only when done rendering
		}
		else {
			// Reset x position
			if (camera.position.x < 0) {
				// Finish
				camera.position.set(0, 5, this.turn * 2)
			}
			else {
				// Still with animation
				requestAnimationFrame(this.swapView.bind(this));
				camera.position.x-= 0.01;	
			}
		}
	}
	/********************************* PIECE LOGICS **************************************************/
	setDisplacement(index) {
		// Return the displacement according from the actual piece index to any adjacent index: displacement is basically index.x - actual.x and index.y - this.y
		let x= parseInt(this.actual.index / 9);	// Get the line
		let y= this.actual.index % 9;
		let a= parseInt(index /9);
		let b= index % 9;

		let r;
		if (x == a) {
			// Same row
			this.displacement= y > b? -1: 1;
		}
		else if (y == b) {
			// Same column
			this.displacement= x > a? -9: 9;
		}
		else if (x > a) {
			this.displacement= y > b? -10: -8;
		}
		else 
			this.displacement= y > b? 8: 10;
	}
	getMoveMethod(displacement) {
		// Get the move method according to a given displacement
		switch (displacement) {
			case -9:
				return up;
			case 9:
				return down;
			case -1:
				return left;
			case 1:
				return right;
			case -8:
				return upperRight;
			case 8:
				return lowerLeft;
			case -10:
				return upperLeft;
			case +10:
				return lowerRight;
		}
	}
	processMoves(piece) {
		// Process the valid moves for a given piece
		// LINEAR MOVES
		// Reset the moves
		piece.setMoves= {};
		let adjacents= Mover.cross(piece.index, 1);	// For adjacent positions
		let seconds= Mover.cross(piece.index, 2);	// For captures
		let normalMoves= [];	// Normal moves
		let percussions= [];	// Percussion captures
		let aspirations= [];	// Aspiration captures
		// DIAGONALS
		// Only multiple of 2 index can move diagonaly
		if (piece.index % 2 == 0){
			adjacents.push(...Mover.diagonal(piece.index));
			seconds.push(...Mover.diagonal(piece.index, 2));
		}

		for (let i= 0; i < adjacents.length; i++) {
			if (adjacents[i] !== null) {
				let place= this.game[adjacents[i]];	// Check for free place

				if (place == 0) {
					// Piece can move here because it's 0
					let secondNeighbour= seconds[i];	// The place next to the free one

					// Normal moves
					if (!(percussions.length || aspirations.length))	// If we don't have valid captures yet
						normalMoves.push(adjacents[i]);

					// If we have an ennemie on the second neighbor position, IT'S A CAPTURE BY PERCUSSION
					if (secondNeighbour !== null && this.game[secondNeighbour] && this.game[secondNeighbour].value != this.turn) {
						percussions.push(adjacents[i]);	// Push the percussions array
					}

					// CAPTURE BY ASPIRATION LOGICS
					if (i % 2 == 0) {
						// We have opposite direction going by sequencial pairs
						let aspiration= adjacents[i+1];
						if (aspiration !== null && this.game[aspiration] && this.game[aspiration].value != this.turn) {
							aspirations.push(adjacents[i]);	// Push the aspirations array
						}
					}	// End if
					else {
						let aspiration= adjacents[i-1];
						if (aspiration !== null && this.game[aspiration] && this.game[aspiration].value != this.turn) {
							aspirations.push(adjacents[i]);	// Push the aspirations array
						}
					}	// End else
				}	// End if place == 0
			}	// End if adjacents[i] !== null
		}	// End for
		// Filter the moves
		// Adding the moves to the piece
		if (percussions.length || aspirations.length) {
			// In case of captures
			piece.setMoves= {percussions, aspirations};
		}
		else {
			// Normal moves
			piece.setMoves= {normalMoves};	// Set valid moves
		}
	}
	filterMoves() {
		// Takeout places where the actual piece already went and where the displacement is same as teh previous one
		let validMoves= {};	// Empty object
		for (let move in this.actual.moves) {
			validMoves[move]= this.actual.moves[move].filter((index) => {
				// Return true when the sequence does not includes index and the displacement is not the same as the previous one displacement
				return !this.moveSequence.includes(index) && Math.abs(index - this.actual.index) != Math.abs(this.displacement);
			});	// End foreach
		}	// End for move of actual.moves
		this.actual.setMoves= validMoves;	// Set the moves of the actual piece
	}
	processAllMoves() {
		// Change gui
		this.movablePieces= [];	// To store the movable piece
		// PROCESS THE VALID MOVES
		let canCapture= false;	// Flag to see if the actual player can capture
		for (let element of this.game) {
			if (element != 0) {
				// Set default color
				element.default();
				if (element.value == this.turn) {
					// Piece having the turn
					this.processMoves(element);
					if (element.canCapture) {
						// If a piece can capture
						if (!canCapture) {
							// The first element that can capture
							canCapture= true;
							this.movablePieces= [element];	// A new array containing the actual piece
						}
						else {
							this.movablePieces.push(element);	// Add to the movable piece
						}
					}	// End if the element can capture
					else {
						// Normal moves
						if (!canCapture) {
							this.movablePieces.push(element);
						}
					}	// End if the element has only normal moves
				}	// End if element is not 0
				else if (element != 0) {
					// Set opponent piece as movable because they need to be marked
					element.setAsMovable();
					element.movable= false;	// Make them unable to move or even be selected
				}
			}
		};	// End forEach

		// Change gui
		this.movablePieces.forEach((piece) => {
			piece.setAsMovable();	// To implement
		});
	}
	/******************************************************* ACTUAL PIECE logics ******************************************/
	set setActual(piece) {
		// Set the actual properties
		if (this.actual != undefined) {
			// First deselect the actual piece
			this.actual.setAsMovable();
			// Clear the board from previous marks
			this.board.unplot();
		}
		// Set the new actual piece
		this.actual= piece;
		piece.select();	// UI
		// Plot the moves of the actual piece on the board
		this.board.plot(piece);
	}
	capture(isPercussion= true) {
		// Capture logic
		let move, index;	// Move method and the index of the piece to be removed

		if (isPercussion) {
			// To move
			move= this.getMoveMethod(this.displacement);	// Get the move method to analyse the displacement
			index= move(this.actual.index, 1);	// Adjacent piece
		}
		// Aspiration
		else {
			//  While index is not null and the index has a piece and it is an opposite piece
			move= this.getMoveMethod(-this.displacement);	// The opposite direction
			index= move(this.actual.index, 2);	// Separated by an empty point
		}

		// console.log(index);
		// Start removal
		while (index !== null && this.game[index] && this.game[index].value != this.turn) {
			// While index is not null and the index has a piece and it is an opposite piece
			this.board.remove(this.game[index]);	// Take pieces from the board
			this.game[index]= 0;	// No piece there
			index= move(index, 1);	// Next move
		}
	}
	choiceMode() {
		// Manage the choice of the piece to capture
		let percussion= this.getMoveMethod(this.displacement)(this.actual.index, 1);	// Get the index of the piece to percute
		let aspiration=	this.getMoveMethod(-this.displacement)(this.actual.index, 2);	// Get the index of the piece to aspire
		// Set the 2 as capturable
		this.game[percussion].setAsCapturable();
		this.game[aspiration].setAsCapturable();
		this.choices= [percussion, aspiration];	// It is a tuple with 2 elements
	}
	evaluate() {
		// Evaluate moves for the actual piece and work upon it
		// If we captured on the previous move
		if (this.actual.canCapture) {
			this.processMoves(this.actual);	// Recalculate actual piece moves
			this.filterMoves();	// Filter the moves
			// If no capture (as a second move is only allowed by captures), drop definitively
			if (!this.actual.canCapture) {
				// Stop and swap turn
				this.swapTurn();
			}
			else {
				// Plot valid moves
				this.board.plot(this.actual);
			}
		}
		else {
			this.swapTurn();
		}
	}
	choose(piece) {
		// Choose the direction of the capture according to the position of the piece in the choices array
		if (this.choices.indexOf(piece.index) == 0) {
			// Percute
			this.capture(true);
			this.game[this.choices[1]].setAsMovable();	// Set the other one's color
			this.game[this.choices[1]].movable= false;	// Don't allow it to move
		}
		else {
			// Aspire
			this.capture(false);
			this.game[this.choices[0]].setAsMovable();	// Set the other one's color
			this.game[this.choices[0]].movable= false;	// Don't allow it to move
		}
		// Reset choice to an empty array
		this.choices= [];
		this.evaluate();	// Evaluate moves for actual piece
	}
	drop(canDropHere) {
		// Drop the piece on the object emplacement
		this.actual.position.set(canDropHere.position.x, 0.19, canDropHere.position.z);	// Set the actual piece position
		this.board.unplot();	// Remove the board marks
		// Make the others unmovable as actual has already been moved
		for (let piece of this.movablePieces) {
			if (piece != this.actual) {
				piece.default();	// Reset to default (can't move, no move valid, changed color)
			}
		}

		// New index is given by 9 * (canDropHere.position.z + 2) + canDropHere.position.x + 4
		let index= 9 * (canDropHere.position.z + 2) + canDropHere.position.x + 4;
		
		this.setDisplacement(index);	// Set the displacement
		// Move the piece in the game array
		this.game[this.actual.index]= 0;	// Change the value of the previous position in the array
		this.moveSequence.push(this.actual.index);	// Push the leaved index in the moveSequence array
		this.game[index]= this.actual;	// Put the actual piece in its new index
		this.actual.index= index; 	// Set the new index

		// In case of Capture
		if (!this.actual.moves.normalMoves) {
			// If the index is in both percussions and aspirations
			if (this.actual.moves.percussions.includes(index) && this.actual.moves.aspirations.includes(index)) {
				// Enter choice mode
				this.choiceMode();
				return ;	// End the dropping
			}
			else if (this.actual.moves.percussions.includes(index)) {
				// Percussion capture
				this.capture();
			}
			else {
				// Aspiration capture
				this.capture(false);
			}
		}

		this.evaluate();	// Evaluate moves for actual piece
	}
}