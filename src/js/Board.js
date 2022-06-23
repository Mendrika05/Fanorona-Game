// Definition of the Board class
import { PlaneGeometry, CircleGeometry, BoxGeometry, MeshStandardMaterial, TextureLoader, LinearFilter, Mesh, MeshBasicMaterial, Vector2 } from 'three';
import { COLORS, turn } from './constants';
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
		// console.log(this.game);
		this.processMoves();
	}
	updateColor() {
		let changing= -1;	// The material to change first
		for (let piece of this.game) {
			if (piece && piece.value == changing ) {
				piece.updateColor();
				if (changing == -1)	// Change the material to change
					changing= 1;
				else
					break;	// done changing material
			} 
		}
	}
	getBoardPosition(index) {
		let lig= parseInt(index / 9);
		let col= index % 9;
		// console.log(lig, col);

		return new Vector2(col - 4,  lig - 2);	// x and z respectively in the 3d representation 
	}
	check() {
		// Check if it is a valid moving piece
		return this.movingList.includes(actualPiece);
	}
	color() {
		// Color the valid path of the actual piece
		this.marks= [];
		let circleGeo= new CircleGeometry(0.23, 60);
		let circleMat= new MeshBasicMaterial({color: COLORS.SELECTION})
		if (actualPiece) {
			for (let move of actualPiece.moves.list) {
				console.log(actualPiece.moves);
				let circle= new Mesh(circleGeo, circleMat);
				let position= this.getBoardPosition(move);
				// console.log(position);
				circle.rotation.x= -0.5 * Math.PI;	// Radian rotation
				circle.position.set(position.x, 0.14, position.y);
				circle.userData.droppable= true;	// To set the droppable area
				this.add(circle);
				this.marks.push(circle);
			}
		}
	}
	clear() {
		// Opposite to the color method
		this.marks[0].geometry.dispose();
		this.marks[0].material.dispose();
		for (let mark of this.marks)
			this.remove(mark);
	}
	capture() {
		this.remove();
	}
	swapTurn() {
		// Swap turn
		turn*= -1;
	}
	getTurn() {
		// Return a list of the pieces having the current turn
		return this.game.filter((piece) => {
			return piece && piece.value == turn;
		})
	}
	processMoves() {
		// To help process move at start
		let captureMode= false;
		let movingList= this.getTurn();	// List all valid moves
		// Process all valid moves
		for (let piece of movingList) {
			if (piece) {
				piece.processMoves();
				if (piece.moves.areCaptures)
					captureMode= true;	// Toggle capture
			}
		}
		// If capture mode, only allow captures
		if (captureMode) {
			movingList= movingList.filter(piece => {
				return piece.moves.areCaptures;
			});
		}
		this.movingList= movingList;
	}
}

export default Board;