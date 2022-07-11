/********************** PIECE CLASS DEFINITION ************************/
import { CylinderGeometry, MeshStandardMaterial, Mesh } from 'three';
import { COLORS } from './constants';

// PIECES' GEOMETRY AND MATERIALS
const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);	// Piece Geometry
const pieceMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1, transparent: true, opacity: .5});	// Piece Material for Player 1
const pieceMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2, transparent: true, opacity: .5});	// Piece Material for Player 2
const selectedMaterial= new MeshStandardMaterial({color: COLORS.SELECTION});	// Selected piece
const selectableMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1});	// Selectable piece for Player 1
const selectableMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2});	// Selectable piece for Player 2
const capturableMaterial= new MeshStandardMaterial({color: COLORS.CAPTURABLE});	// Capturable piece

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
		this.capturable= false;	// Not capturable
		this.castShadow= true;	// Shadow
		this.moves= undefined;	// To track moves
	}	// End of constructor

	/**************************** USER INTERFACE CHANGES *********************************/
	default() {
		// Set default value
		this.movable= false;	// Can't move
		this.moves= undefined;	// Has no moves
		this.capturable= false;	// Not capturable
		this.material= this.value == 1? pieceMaterial1: pieceMaterial2;	// Reset material
	}
	select() {
		// When the piece is selected
		this.material= selectedMaterial;
	}
	removeTransparence() {
		// Set the material to transparent
		this.material= this.value == 1? selectableMaterial1: selectableMaterial2;
	}
	setAsMovable() {
		// Change material to the movable material
		this.removeTransparence();
		this.movable= true;
	}
	setAsCapturable() {
		// Set the piece as capturable
		this.material= capturableMaterial;
		this.capturable= true;
	}
	set setMoves(moveObject) {
		this.moves= moveObject;
	}
	get canCapture() {
		// Return true if the piece can capture, else false
		return (this.moves.percussions != undefined && this.moves.percussions.length || this.moves.aspirations && this.moves.aspirations.length);
	}
	updateColor() {
		// Update material
		if (this.value == 1) {
			// Player 1
			pieceMaterial1.color.set(COLORS.PLAYER1);
			selectableMaterial1.color.set(COLORS.PLAYER1);
		}
		else {
			// Player 2
			pieceMaterial2.color.set(COLORS.PLAYER2);
			selectableMaterial2.color.set(COLORS.PLAYER2);
		}
	}
}
