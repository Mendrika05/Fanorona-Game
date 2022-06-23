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

	processMoves(index) {
		this.moves= [];
		// Misy capture ve?
		// Vatany
		switch (index) {

			// four corners of the board
			case 0:
				this.moves.push(index+1, index+9, index+10);
				break;
			case 8:
				this.moves.push(index-1, index+8, index+9);
				break;
			case 36:
				this.moves.push(index+1, index-8, index-9);
				break;
			case 45:
				this.moves.push(index-1, index-8, index-9);
				break;

			//	top side of the board (pair)
			case 2:
				this.moves.push(index-1, index+1, index+8, index+9, index+10);
				break;
			case 4:
				this.moves.push(index-1, index+1, index+8, index+9, index+10);
				break;
			case 6:
				this.moves.push(index-1, index+1, index+8, index+9, index+10);
				break;
			
			//	top side of the board (impair)
			case 1:
				this.moves.push(index-1, index+1, index+9);
				break;
			case 3:
				this.moves.push(index-1, index+1, index+9);
				break;
			case 5:
				this.moves.push(index-1, index+1, index+9);
				break;
			case 7:
				this.moves.push(index-1, index+1, index+9);
				break;

			//	bottom side of the board (pair)
			case 38:
				this.moves.push(index-1, index+1, index-8, index-9, index-10);
				break;
			case 40:
				this.moves.push(index-1, index+1, index-8, index-9, index-10);
				break;
			case 42:
				this.moves.push(index-1, index+1, index-8, index-9, index-10);
				break;

			//	bottom side of the board (impair)
			case 37:
				this.moves.push(index-1, index+1, index-9);
				break;
			case 39:
				this.moves.push(index-1, index+1, index-9);
				break;
			case 41:
				this.moves.push(index-1, index+1, index-9);
				break;
			case 43:
				this.moves.push(index-1, index+1, index-9);
				break;

			
			//	left sides of the table (pair)
			case 18:
				this.moves.push(index+1, index-8, index-9, index+9, index+10);
				break;

			//	left sides of the table (impair)
			case 9:
				this.moves.push(index+1, index-9, index+9);
				break;
			case 27:
				this.moves.push(index+1, index-9, index+9);
				break;

			//	right sides of the table (pair)
			case 26:
				this.moves.push(index-1, index+8, index-9, index+9, index-10);
				break;

			//	right sides of the table (impair)
			case 17:
				this.moves.push(index-1, index-9, index+9);
				break;
			case 35:
				this.moves.push(index-1, index-9, index+9);
				break;
			
			default: {
				if (index%2 == 0){
					this.moves.push(index-1, index+1, index-8, index+8, index-9, index+9, index-10, index+10);
				}
				else{
					this.moves.push(index-1, index+1, index-9, index+9);
				}
			}
		}
	}
	// Add all valid moves to this.moves
	// 	const edges= [0, 8, 36, 45];
	// 	const pieceTab = [index-1, index+1, index-8, index+8, index-9, index+9, index-10, index+10];
		
	// 	
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
