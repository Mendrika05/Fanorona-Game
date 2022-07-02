/********************** PIECE CLASS DEFINITION ************************/
import { CylinderGeometry, MeshStandardMaterial, Mesh } from 'three';
import { COLORS } from './constants';

// PIECES' GEOMETRY AND MATERIALS
const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);	// Piece Geometry
const pieceMaterial1= new MeshStandardMaterial({color: COLORS.PLAYER1});	// Piece Material for Player 1
const pieceMaterial2= new MeshStandardMaterial({color: COLORS.PLAYER2});	// Piece Material for Player 2

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
		this.castShadow= true;	// Shadow
	}	// End of constructor
}
