/********************************** GAME BOARD USER INTERFACE ****************************************/
import { PlaneGeometry, BoxGeometry, MeshStandardMaterial, TextureLoader, LinearFilter, Mesh, MeshBasicMaterial, DoubleSide } from 'three';
import { COLORS } from './constants';
import Laka from '../img/Laka.png';

export default class Board extends Mesh {
	constructor(scene) {
		super(
			new BoxGeometry(9, 0.25, 5),
			new MeshStandardMaterial({
				color: COLORS.BOARD,
			})
		);

		// Placing the board mark
		let textureLoader= new TextureLoader();
		const tl= textureLoader.load(Laka);
		tl.minFilter= LinearFilter;	// To avoid resizing warnings
		let mark= new Mesh(
			new PlaneGeometry(8, 4.25),
			new MeshStandardMaterial({
				color: COLORS.BOARD,
				map: tl	// The image
			})
		);
		// Properties
		mark.userData.isBoard= true;	// The image
		mark.rotation.x= -0.5 * Math.PI;// Rotate the plane
		mark.position.y= 0.13;
		mark.receiveShadow= true;

		// Board property
		this.receiveShadow= true;	// Receive shadow
		this.castShadow= true;	// Cast shadow
		this.add(mark);

		// this.inRotation= true;	// Rotation flag
		// this.rotate();
		/*************************************************** THE TABLE *********************************************************/
		const plane= new Mesh(
				new PlaneGeometry(15, 8),
				new MeshStandardMaterial({
					color: 0x3F1A0B,
					side: DoubleSide
				})
			);
		this.add(plane);
		// Table properties
		plane.rotation.x= 0.5 * Math.PI;
		plane.position.y= -0.13;
		plane.receiveShadow= true;

		// Add it to the scene
		scene.add(this);
	}	// end of contructor()


	place(piece) {
		// Place a piece on the board
		/*
			-- POSITIONS --
			let x and y be the positions on the board and i and j the matrix coordinates:
			x= -4 + j <========> j= x + 4
			y= -2 + i <========> i= y + 2
			where i= parseInt(index / 9) and j= index % 9 <==================> index= i * 9 + j
		*/
		this.add(piece);	// Add the piece to the board

		// Position it
		const x= piece.index % 9 -  4, y= parseInt(piece.index / 9) - 2;	// The position in the board is x= col - 4, y= lig - 2 where col= index % 9 and lig= parseInt((index / 9)
		piece.position.set(x, 0.19, y);	// x and z in 3D are respectively x and y in 2D
	}
}