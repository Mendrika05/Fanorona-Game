// Definition of the Piece class
import { CylinderGeometry, MeshStandardMaterial, Vector2, Mesh } from 'three';
import { COLORS } from './constants';

const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);

const Piece= class Piece extends Mesh {
	constructor(parentBoard, value= 1, x= 0, y= 0, index) {
		super(pieceGeometry, new MeshStandardMaterial({
				color: value == 1? COLORS.PLAYER1: COLORS.PLAYER2	// Setting the piece color
			})
		);	// Parent constructor
		parentBoard.add(this);	// Add it to the parent board
		
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
		this.moves= [];
	}
	drag(intersection) {
		// Drag a piece according to the intersection
		if (intersection.object.userData.isBoard) {	// If we are on the board
			// Set the piece position
			this.position.set(parseInt(intersection.point.x), 0.3, parseInt(intersection.point.z));
		}
	}
	drop() {
		// Drop the piece on the board
		this.position.y= 0.19;
		this.updateColor();
	}
	select() {
		this.material.color.set(COLORS.SELECTION);
	}
	// Color manipulation
	updateColor() {
		this.material.color.set(this.value == 1? COLORS.PLAYER1: COLORS.PLAYER2); 
	}
	processMoves() {
		this.moves= [];
		// Misy capture ve?
		// Vatany
	}
	// Add all valid moves to this.moves
	// 	const edges= [0, 8, 36, 45];
	// 	const pieceTab = [index-1, index+1, index-8, index+8, index-9, index+9, index-10, index+10];
		
	// 	switch (index) {
	// 		case 0:
	// 		case 8:
	// 		case 36
	// 		case 45:
	// 		default: {

	// 		}	
	// 	}
	// 	if (index%2 == 0){
			
	// 		for(let i of pieceTab)
	// 		while()
	// 	}
	// 	else{
	// 		pieceTab = [index]
	// 	}
	// }
}

export default Piece;
