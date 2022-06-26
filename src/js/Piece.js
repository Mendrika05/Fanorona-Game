// Definition of the Piece class
import { CylinderGeometry, MeshStandardMaterial, MeshPhongMaterial, CircleGeometry, Vector2, Mesh } from 'three';
import { COLORS } from './constants';

const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);
const pieceMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1});
const pieceMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2});
const markerGeo= new CylinderGeometry(0.25, 0.25, 0.1, 10);
const markerMat= new MeshStandardMaterial({color: COLORS.SELECTION, transparent: true, opacity: 0.2});
const selectableMat1= new MeshStandardMaterial({color: COLORS.PLAYER1, transparent: true, opacity: 0.7});
const selectableMat2= new MeshStandardMaterial({color: COLORS.PLAYER2, transparent: true, opacity: 0.7});

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

	if(index + 9 > 44)
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
			upperLeft(index, step), lowerRight(index, step),	// Left from bottom to top
			upperRight(index, step), lowerLeft(index, step)	// Right from bottom to top
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
		this.moves= {
			areCaptures: false,
			series: [],
			list: [],
		};	// Informations about the valid moves
		this.displacement= 0;
		this.step= 0;
		// this.next;	// The next element
		// this.hasMoved= false;	// To track moves
	}

	/* Setting methods */
	setDisplacement(position) {
		let x= parseInt(this.index / 9);
		let y= this.index % 9;
		let a= parseInt(position /9);
		let b= position % 9;

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
	getMoveMethod(disp) {
		switch (disp) {
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
	processMoves() {
		let positions= mover.cross(this.index, 1);	// For positions around
		let seconds= mover.cross(this.index, 2);	// For captures
		let normalMoves= [];
		let captures= [];
		// Only multiple of 2 index can move diagonaly
		if (this.index % 2 == 0){
			positions.push(...mover.diagonal(this.index));
			seconds.push(...mover.diagonal(this.index, 2));
		}

		for (let i= 0; i < positions.length; i++) {
			if (positions[i] !== null) {
				let piece= this.parentBoard.game[positions[i]];	// Check for free place

				if (!piece) {
					// Can move here beacuse it's 0
					let second= seconds[i];	// The place after next to the free one
					let capt= [];	// [collision, aspiration]: null if no collision nor aspiration
					if (!captures.length)	// If we don't have valid captures yet
						normalMoves.push(positions[i]);

					if (second !== null && this.parentBoard.game[second] && this.parentBoard.game[second].value != this.value) {
						// If not outside the board and there piece is a capturable piece opposed to us
						capt.push(positions[i]);	// THIS IS A CAPTURE BY COLLISION
					}
					else capt.push(null);

					if (i % 2 == 0) {
						// We have opposite direction going by sequencial pairs
						let aspiration= positions[i+1];
						if (aspiration !== null && this.parentBoard.game[aspiration] && this.parentBoard.game[aspiration].value != this.value) {
							// If not outside the board and there piece is a capturable piece opposed to us
							capt.push(positions[i]);	// THIS IS A CAPTURE BY COLLISION
						}
						else capt.push(null);
					}
					else {
						let aspiration= positions[i-1];
						if (aspiration !== null && this.parentBoard.game[aspiration] && this.parentBoard.game[aspiration].value != this.value) {
							// If not outside the board and there piece is a capturable piece opposed to us
							capt.push(positions[i]);	// THIS IS A CAPTURE BY COLLISION
						}
						else capt.push(null);
					}

					if (capt[0] !== null || capt[1] !== null)
						// Add the captures possibilities to the captures array
						captures.push(capt);

				}
			}
		}
		// Setting moves according to captures' length
		this.moves.areCaptures= captures.length? true: false;	// The type of moves
		this.moves.list= captures.length? captures: normalMoves;	// N.B. Captures go by pair of (collision, aspiration)
		this.filterMoves();
	}
	filterMoves() {
		// Takeout places where we already went
		if (this.moves.areCaptures) {
			this.moves.list= this.moves.list.filter(([collision, aspiration]) => {
				// Series
				if (collision != null && this.moves.series.includes(collision)){
					return false;
				}
				if (aspiration != null && this.moves.series.includes(aspiration)){
					return false;
				}
				// Displacement
				if (Math.abs(collision - this.index) == Math.abs(this.displacement)){
					return false;
				}
				if (Math.abs(aspiration - this.index) == Math.abs(this.displacement)){
					return false;
				}
				return true;
			})
		}
		else {
			this.moves.list= this.moves.list.filter((move) => {
				return !(this.moves.series.includes(move) || Math.abs(move - this.index) == Math.abs(this.displacement));
			})
		}
	}
	/************************************************************* State management methods ************************************************************/
	setSelectable() {
		this.selectable= true;
		this.material= this.value == 1? pieceMaterial1: pieceMaterial2;
	}
	resetPosition() {
		// Reset the position in case of a bad drop
		let lig= parseInt(this.index / 9);
		let col= this.index % 9;

		// Correspondances of x and z with col and lig are respectively col - 4 and lig - 2
		this.position.set(col - 4, 0.19, lig - 2);
	}
	endTurn() {
		this.moves= {
			list: [],
			series: [],
			areCaptures: false
		}
		this.clear();
		this.normal= 0;
		this.updateColor();
		this.hasMoved= false;
		this.displacement= 0;	// Reset displacement
		this.parentBoard.swapTurn();
	}
	select() {
		// Change the individual color of the selected element
		this.material= new MeshStandardMaterial({color: COLORS.SELECTION});
		this.parentBoard.actual= this;
		this.color();
	}
	/************************************************** DRAG AND DROPS AND CAPTURES ************************************************************/
	capture(position) {
		// To capture
		let direction= this.moves.list.find((couple) => {
			return couple.includes(position);
		});
		let move;

		if (direction[0] == direction[1]) {
			// Choose between the 2
			let choice= prompt('0/ Collision\n1/ Aspiration\n(Default: Collision)');

			if (choice == undefined || choice == 0) {
				direction[1]= null;	// Collision
			}
			else {
				direction[0]= null;	// Aspiration
			}
		}
		if (direction[0]) {
			// To move
			move= this.getMoveMethod(this.displacement);	// The same direction
			let index= move(position, 1);
			while (index !== null && this.parentBoard.game[index] && this.parentBoard.game[index].value != this.value) {
				this.parentBoard.removePiece(index);	// Take pieces from the board
				index= move(index, 1);
			}
		}
		// Aspiration
		else if (direction[1]) {
			// To move
			move= this.getMoveMethod(-this.displacement);	// The opposite direction
			let index;
			index= move(position, 2);
			while (index !== null && this.parentBoard.game[index] && this.parentBoard.game[index].value != this.value) {
				this.parentBoard.removePiece(index);	// Take pieces from the board
				index= move(index, 1);
			}
		}
	}
	drag(intersection) {
		// Drag a piece according to the intersection
		if (intersection.object.userData.isBoard) {	// If we are on the board
			// Set the piece position
			this.position.x= intersection.point.x;
			this.position.z= intersection.point.z;
		}
	}
	drop(intersection) {
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
		if (intersection.object.userData.droppable) {	// Check if it is a valid move
			let x= intersection.object.position.x;
			let z= intersection.object.position.z;
			this.clear();
			this.parentBoard.lock();
			this.setDisplacement(z * 9 + x + 22);	// Setting the displacement
			
			if (this.moves.areCaptures) {
				this.capture(z * 9 + x + 22);	// We pass the index from where we capture which is given by the above formula as z * 9 + x + 22
				this.moves.series.push(this.index);	// Save already taken paths
			}
			// Move it in the game array
			
			this.parentBoard.game[this.index]= 0;
			// this.next= [x, z];	// The next position
			this.position.set(x, 0.19, z);
			this.index=	z * 9 + x + 22; // Set new index
			this.parentBoard.game[this.index]= this;
			
			if (this.parentBoard.checkForWin()) {
				return false;
			}

			if (document.getElementById('end-turn').style.display == 'none') {
				// Place the end turn button
				document.getElementById('end-turn').style.display = 'block';
			}
			// Recalculate moves
			if (this.moves.areCaptures) {
				this.processMoves();
				if (this.moves.list.length && this.moves.areCaptures) {
					// Continue moving captures
					this.select();
					this.resetPosition();
					return false;
				}
				else {
					this.endTurn();
					return true;
				}
			}
			else {
				this.endTurn();
				return true;
			}
		}
		else {
			// Drop at the start position
			this.updateColor();
			this.resetPosition();
			this.clear();
			return true;
		}
	}
	/*************************************************** COLOR MANAGEMENT **********************************************************************/
	addMarks(index, material= markerMat) {
		function getBoardPosition(index) {
			let lig= parseInt(index / 9);
			let col= index % 9;

			return new Vector2(col - 4,  lig - 2);	// x and z respectively in the 3d representation 
		}
		let circle= new Mesh(markerGeo, material);
		let position= getBoardPosition(index);
		// circle.rotation.x= -0.5 * Math.PI;	// Radian rotation
		circle.position.set(position.x, 0.2, position.y);
		circle.userData.droppable= true;	// To set the droppable area
		this.parentBoard.add(circle);
		this.marks.push(circle);
	}
	updateColor() {
		// Update the color
		pieceMaterial1.color.set(COLORS.PLAYER1);
		pieceMaterial2.color.set(COLORS.PLAYER2);
		selectableMat1.color.set(COLORS.PLAYER1);
		selectableMat2.color.set(COLORS.PLAYER2);
		if (!this.selectable)
			this.material= this.value == 1? selectableMat1: selectableMat2; 
		else
			this.material= this.value == 1? pieceMaterial1: pieceMaterial2;
	}
	color() {
		// Add the marks of valid moves to the board
		this.marks= [];
		if (this.moves.areCaptures) {
			// Captures goes by pair (collision, aspiration)
			this.moves.list.forEach(([collision, aspiration]) => {
				if (collision !== null) {
					this.addMarks(collision);
				}
				if (aspiration !== null) {
					this.addMarks(aspiration);
				}
				
			});
		}
		else {
			this.moves.list.forEach( move => {
				this.addMarks(move);
			});
		}
	}
	clear() {
		// Opposite to the color method
		if (this.marks.length) {
			this.marks[0].geometry.dispose();
			this.marks[0].material.dispose();
			for (let mark of this.marks) {
				this.parentBoard.remove(mark);
			}
		}
	}
}

export default Piece;
