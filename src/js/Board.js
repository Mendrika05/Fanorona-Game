// Definition of the Board class
import { PlaneGeometry, BoxGeometry, MeshStandardMaterial, TextureLoader, LinearFilter, Mesh, MeshBasicMaterial, Vector2 } from 'three';
import { COLORS } from './constants';
import { actualPiece } from './eventHandlers';
import Piece from './Piece'
import Laka from '../img/Laka.png';

const boardMaterial= new MeshStandardMaterial({
	color: COLORS.BOARD,
});

class Board extends Mesh {
	constructor() { 
		super(new BoxGeometry(9, 0.25, 5), boardMaterial);

		this.game= [];

		// Placing the board mark
		let textureLoader= new TextureLoader();
		const tl= textureLoader.load(Laka);
		tl.minFilter= LinearFilter;	// To avoid resizing warnings
		let mark= new Mesh(new PlaneGeometry(8, 4.25), new MeshStandardMaterial({
			color: COLORS.BOARD,
			map: tl	// Image
		}));
		
		// Properties
		mark.userData.isBoard= true;	// The image
		mark.rotation.x= -0.5 * Math.PI;// Rotate the plane
		mark.position.y= 0.13;
		
		mark.receiveShadow= true;
		this.receiveShadow= true;
		this.castShadow= true;

		this.add(mark);
	}

	init() {
		// Placing pieces on the board
		let piece;
		for (let i= 0; i < 5; i++) {	// By line
			for (let j= 0; j < 9; j++) {	// By column
				if (i == 2 && j == 4) {
					// Skip the center of the board
					this.game.push(0);
					continue;
				}
				
				// Color setting
				let value= i < 2? -1: i > 2? 1: j < 4? [-1, 1][j % 2]: [1, -1][j % 2];	// -1 is White (player 2) and 1 is Black (player 1)
				
				/* POSITIONS */
				// x= -8 + j * 2;	// ========> j= x + 8 / 2
				// y= -4 + i * 2;	// ========> i= y + 4 / 2
				/*
					In an array, to store a 5*9 matrix, we can use the following correspondance:
					let i be the line in the matrix and j be the column
					pos: the index in the corresponding array would be given by the formula
					=> pos= i * col + j where col is the number of column (here 9)
					THIS IS TO MARK THE POSITION OF THE PIECE IN THE MOVE ARRAY
				*/
				piece= new Piece(this, value, -4 + j, -2 + i, i * 9 + j);	// Piece(parentBoard, value, x, y, index)
				this.game.push(piece);	// The main array store the pieces to be manipulated in the logics
			}
		}
	}
	updateColor() {
		this.game.forEach(piece => {
			if (piece) piece.updateColor();
		});
	}
	getBoardPosition(index) {
		let lig= parseInt(index / 9);
		let col= index % 9;

		return new Vector2(lig - 2, col -4);	// x et z, ras de board 
	}
	color() {
		console.log(actualPiece);
		if (actualPiece) {
			console.log(actualPiece);
			for (let move of actualPiece.moves) {
				let circle= new Mesh(new BoxGeometry(0.1, 10, 0.1), new MeshBasicMaterial({color: 0xff0000}))
				let position= this.getBoardPosition(move);
				circle.position.set(position.x, 0.25, position.y);
				this.add(circle);
			}
		}
	}
	capture() {
		this.remove();
	}
	processMoves() {
		// 
	}
}

export default Board;