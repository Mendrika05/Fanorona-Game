/********************** PIECE CLASS DEFINITION ************************/
import { CylinderGeometry, MeshStandardMaterial, Mesh } from 'three';
import { COLORS } from './constants';
import { top, bottom, left, right, upperLeft, upperRight, lowerLeft, lowerRight, Mover } from './moves';

// PIECES' GEOMETRY AND MATERIALS
const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);	// Piece Geometry
const pieceMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1});	// Piece Material for Player 1
const pieceMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2});	// Piece Material for Player 2
const selectedMaterial1= new MeshStandardMaterial({color: COLORS.SELECTION});	// Selection piece for Player 1
const selectableMaterial1= new MeshStandardMaterial({color: COLORS.SELECTABLE});	// Selectable piece for Player 1

export default class Piece extends Mesh {
	constructor(value, index) {
		/*
			params:
				value: 1 for player 1 and -1 for player 2
				index: the position in the game
		*/
		super(pieceGeometry, value == 1? pieceMaterial1: pieceMaterial2);	// The Mesh describing the piece

		// Properties
		this.isPiece= true;	// To say that it is a piece
		this.index= index;	// The position in the current array
		this.value= value;	// 1 means grey, -1 means white
		this.movable= false;	// If it is selectable then we can drag it
		this.castShadow= true;	// Shadow
		this.moves= undefined;	// To track moves
		this.displacement= 0;	// Displacement is either up/down (-9, 9), left/right (-1, +1) or one of the diagonals
	}	// End of constructor

	/**************************** USER INTERFACE CHANGES *********************************/
	default() {
		// Set default value
		this.movable= false;
		this.moves= undefined;
		this.displacement= 0;
		this.material= this.value == 1? pieceMaterial1: pieceMaterial2;
	}
	select() {
		// When the piece is selected
		this.material= selectedMaterial1;
	}
	setAsMovable() {
		// Change material to the movable material
		this.movable= true;
		this.material= selectableMaterial1;
	}
	drop(canDropHere) {
		// Drop the piece on the object emplacement
		this.position.set(canDropHere.position.x, 0.19, canDropHere.position.z);
		this.default();	// Reset color
	}
	/********************************* PIECE LOGICS **************************************************/
	setDisplacement(index) {
		// Return the displacement according from this piece to any adjacent index: displacement is basically index.x - this.x and index.y - this.y
		let x= parseInt(this.index / 9);	// Get the line
		let y= this.index % 9;
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
	getMoveMethod(disp) {
		// Get the move method according to this.displacement
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
	setMoves(moveObject) {
		this.moves= moveObject;
	}
}
