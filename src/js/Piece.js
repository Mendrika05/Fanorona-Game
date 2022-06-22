// Definition of the Piece class
import { CylinderGeometry, MeshStandardMaterial, Mesh } from 'three';
import { COLORS } from './constants';

const pieceGeometry= new CylinderGeometry(0.23, 0.23, 0.12, 60);

const Piece= class Piece extends Mesh {
	constructor(parentBoard, value= 1, x= 0, y= 0, index) {
		super(pieceGeometry, new MeshStandardMaterial({
				color: value == 1? COLORS.GREY: COLORS.WHITE	// Setting the piece color
			})
		);	// Parent constructor

		parentBoard.add(this);	// Add it to the parent board

		this.castShadow= true;	// Shadow
		this.value= value;	// 1 means grey, -1 means white
		this.isPiece= true;	// To say that it is a piece
		this.position.set(x, 0.19, y);	// Set it on top of the board and x and y are , in the 3d world, x and z respectively
		this.index= index;	// The position in the current array
	}
}

export default Piece;
