// Definition of the Piece class
import { CylinderGeometry, MeshStandardMaterial, Vector2, Mesh } from 'three';
import { COLORS } from './constants';

const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);
const pieceMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1});
const pieceMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2});

// We consider from bottom to top for diagonals
function toCoord(index) {
	return [parseInt(index / 9), index % 9]
}

function toIndex(position) {
	// Return null if we tresspassed to board
	if (position[0] == 0 || position[0] == 6 || position[1] == 0 || position[1] == 10)	// Border of the board
		return null;
	return 9 * position[0] + position[1];
}
// To move around in the array given an index and a step
// const mover= {
// 	cross: (index, step= 1) => {
// 		switch (index) 
// 		return [
// 			toIndex(toCoord(index - step * 9)), toIndex(toCoord(index + step * 9)),	// Vertical
// 			toIndex(toCoord(index - step * 1)), toIndex(toCoord(index + step * 1))	// Horizontal
// 			];
// 	},
// 	diagonal: (index, step= 1) => {
// 		return [
// 			toIndex(toCoord(index - step * 10)), toIndex(toCoord(index + step * 10)),	// Left from bottom to top
// 			toIndex(toCoord(index - step * 8)), toIndex(toCoord(index + step * 8))	// Right from bottom to top
// 			];
// 	}
// }
// MOVES
function up(index, step= 1) {
	if (index == null)
		return null;

	if(index < 9)
		return null;	// Return to null
	if (step == 1)
		return index - 9;
	return up(up(index, step - 1), 1);
}

function down(index, step= 1) {
	if (index == null)
		return null;

	if(index > 36)
		return null;	// Return to null
	if (step == 1)
		return index + 9;
	return down(down(index, step - 1), 1);
}

function left(index, step= 1) {
	if (index == null)
		return null;

	let col= index % 9;
	if (col - 1 < 0)
		return null;
	if (step == 1)
		return index - 1;
	return left(left(index, step - 1), 1);
}

function right(index, step= 1) {
	if (index == null)
		return null;

	let col= index % 9;
	if (col + 1 > 8)
		return null;
	if (step == 1)
		return index + 1;
	return right(right(index, step - 1), 1);
}

function upperLeft(index, step= 1) {
	return up(left(index, step), step);
}

function upperRight(index, step= 1) {
	return up(right(index, step), step);
}

function lowerLeft(index, step= 1) {
	return down(left(index, step), step);
}

function lowerRight(index, step= 1) {
	return down(right(index, step), step);
}

// To move around in the array given an index and a step
const mover= {
	cross: (index, step= 1) => {
		return [
			up(index, step), down(index, step),	// Vertical
			left(index, step), right(index, step)	// Horizontal
		];
	},
	diagonal: (index, step= 1) => {
		return [
			upperLeft(index, step), upperRight(index, step),	// Left from bottom to top
			lowerLeft(index, step), lowerRight(index, step)	// Right from bottom to top
		];
	}
}

const Piece= class Piece extends Mesh {
	constructor(parentBoard, value= 1, x= 0, y= 0, index) {
		super(pieceGeometry, value == 1? pieceMaterial1: pieceMaterial2);
		this.parentBoard= parentBoard;	// Save the parentBoard
		this.parentBoard.add(this);	// Add it to the parent board
		
		/*
			getBoardPosition() {
				let lig= index / 9;
				let col= index % 9;

				return new Vector2(lig - 2, col -4);	// x et z, ras de board 
			}
		*/

		this.castShadow= true;	// Shadow
		this.value= value;	// 1 means grey, -1 means white
		this.isPiece= true;	// To say that it is a piece
		this.position.set(x, 0.19, y);	// Set it on top of the board and x and y are , in the 3d world, x and z respectively
		this.index= index;	// The position in the current array
		this.moves= {};	// Informations about the valid moves
	}
	drag(intersection) {
		// Drag a piece according to the intersection
		if (intersection.object.userData.isBoard) {	// If we are on the board
			// Set the piece position
			this.position.set(intersection.point.x, 0.3, intersection.point.z);
		}
	}
	drop(intersection) {
		// Drop the piece on the board
		// Turn intersection into array index
		/*
			index= lig * 9 + col;
			lig= index / 9
			col= index % 9
			boardPosition= (col - 4, lig - 2)
			intersection.point.x == col - 4 == index % 9 - 4
			intersection.point.z == lig - 2 == index / 9 - 2
			==> col == intersection.point.x + 4
			==> lig == intersection.point.z + 2
			==> index == lig * 9 + col == (intersection.point.z + 2) * 9 + intersection.point.x + 4
			==> index == (intersection.point.z * 9) + intersection.point.x + 22
				
		*/
		// if (this.moves.list.includes(parseInt((intersection.point.z * 9) + intersection.point.x + 22))) {	// Check if it is a valid move
		// 	this.position.set(parseInt(intersection.point.x), 0.19, parseInt(intersection.point.z));
		// 	if (this.moves.areCaptures) {
		// 		this.capture();
		// 	}
		// }
		if (intersection.object.userData.droppable) {	// Check if it is a valid move
			this.position.set(parseInt(intersection.point.x), 0.19, parseInt(intersection.point.z));
			if (this.moves.areCaptures) {
				this.capture();
			}
		}
		else {
			// Drop at the start position
			this.resetPosition();
		}

		this.updateColor();	// Color updates
		// Clear the board
		this.parentBoard.clear();
	}

	resetPosition() {
		// Reset the position in case of a bad drop
		let lig= parseInt(this.index / 9);
		let col= this.index % 9;

		// Correspondances of x and z with col and lig are respectively col - 4 and lig - 2
		this.position.set(col - 4, 0.19, lig - 2);
	}

	// Color manipulation
	select() {
		// Change the individual color of the selected element
		this.material= new MeshStandardMaterial({color: COLORS.SELECTION});
	}
	updateColor() {
		// Update the color
		this.material.color.set(this.value == 1? COLORS.PLAYER1: COLORS.PLAYER2); 
	}
	processMoves() {
		let positions= mover.cross(this.index);	// For positions around
		let seconds= mover.cross(this.index, 2);	// For captures
		let normalMoves= [];
		let captures= [];
		// Only multiple of 2 index can move diagonaly
		if (this.index % 2 == 0){
			positions.push(...mover.diagonal(this.index));
			seconds.push(...mover.diagonal(this.index, 2));
		}

		if (this.index == 23)
			console.log(seconds);
		// Process the moves
		for (let i= 0; i < positions.length; i++) {
			if (positions[i] !== null) {
				let piece= this.parentBoard.game[positions[i]];
				if (!piece) {
					// Can move here beacuse it's 0
					if (!captures.length)	// If we don't have valid captures yet
						normalMoves.push(positions[i]);
					if (seconds[i] !== null && this.parentBoard.game[seconds[i]] && this.parentBoard.game[seconds[i]].value != this.value) {
						// If not outside the board and there piece is a capturable piece opposed to us
						captures.push(positions[i]);	// THIS IS A CAPTURE
					}
				}
			}
		}
		// Setting moves according to captures' length
		this.moves.areCaptures= captures.length? true: false;	// The type of moves
		this.moves.list= captures.length? captures: normalMoves;	// The list of moves
	}
	capture() {
		// To capture
	}
}

export default Piece;
