// A module to provide the gui
import { Fog, PlaneGeometry, DoubleSide, BoxGeometry, MeshStandardMaterial, Mesh, TextureLoader, LinearFilter, DirectionalLight, AmbientLight } from 'three';	// The Needed Objects
import { AxesHelper, DirectionalLightHelper, CameraHelper } from 'three';	// Helpers
import { renderer, scene, camera,  control, COLORS, mainArray } from './constants';	// Import the basic utilities
import { width, height } from './eventHandlers';
import { onClick, onScreenResize, onTurnChange, onResetCamera, onMouseMove, onNightModeToggle } from './eventHandlers';
import Laka from '../img/Laka.png';	// The board mark
import Piece from './Piece';

function placePieces() {
	// Placing pieces
	let piece;
	for (let i= 0; i < 5; i++) {	// By line
		for (let j= 0; j < 9; j++) {	// By column
			if (i == 2 && j == 4) {
				// Skip the center of the board
				mainArray.push(0);
				continue;
			}
			
			// Color setting
			let value= i < 2? -1: i > 2? 1: j < 4? [1, -1][j % 2]: [1, -1][(j + 1) % 2];	// -1 is White (player 2) and 1 is Black (player 1)
			
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
			piece= new Piece(value, -4 + j, -2 + i, i * 9 + j);	// Piece(value, x, y, index)
			scene.add(piece);
			mainArray.push(piece);	// The main array store the pieces to be manipulated in the logics
		}
	}
}

function render() {
	// The render
	requestAnimationFrame(render);
	control.update();
	renderer.render(scene, camera);
}

function init() {
	// Initialization of the GUI

	// Renderer setup
	renderer.setSize(width, height);	// Size
	renderer.setClearColor(COLORS.DAY);	// Renderer background
	renderer.shadowMap.enabled= true;	// Enable shadows

	// The scene
	scene.fog= new Fog(0x777777, 5, 100);	// Fog

	// The camera
	camera.position.set(0, 5, 2);

	// Orbit Controls
	// control.enabled= !lockCamera;
	// control.enableZoom= false;	// No zooming

	// The TABLE
	/************************************************************************************************************************/
	const plane= new Mesh(
			new PlaneGeometry(15, 8),
			new MeshStandardMaterial({
				color: 0x3F1A0B,
				side: DoubleSide
			})
		);
	scene.add(plane);

	plane.rotation.x= 0.5 * Math.PI;
	plane.receiveShadow= true;
	/**************************************************************************************************************************/

	// THE BOARDS
	/********************************************************************************************************************/
	// The Board
	const boardGeo= new BoxGeometry(9, 0.25, 5);	// Geometry (x: width, y: height, z: depth)
	const boardMat= new MeshStandardMaterial({
		color: COLORS.BOARD
	});
	const board= new Mesh(boardGeo, boardMat);
	scene.add(board);
	
	board.position.y= 0.125;
	// Shadow
	board.receiveShadow= true;
	board.castShadow= true;
	board.userData.isBoard= true;	// Tell that it is the board

	// Board Marks
	// The image for the board marks
	let textureLoader= new TextureLoader();
	const tl= textureLoader.load(Laka);
	tl.minFilter= LinearFilter;	// To avoid resizing warnings
	const mark= new Mesh(
		new PlaneGeometry(8.25, 4.25),
		new MeshStandardMaterial({
			color: COLORS.BOARD,
			map: tl
		})
	);
	board.add(mark);

	// Mark configuration
	mark.rotation.x= -0.5 * Math.PI;// Rotate the plane
	mark.position.y= 0.13;
	mark.receiveShadow= true;
	mark.userData.isBoard= true;
	/*************************************************************************************************************************/

	// THE PIECES
	/***************************************************************************************************************************/
	placePieces();
	/***************************************************************************************************************************/
	// LIGHTS
	/**************************************************************************************************************************/
	const ambient= new AmbientLight(0xffffff);	// Day mode by default
	const directional= new DirectionalLight(0xffffff, 1)
	scene.add(ambient);
	scene.add(directional);

	directional.castShadow= true;
	directional.position.set(-5, 4, -5);
	/**************************************************************************************************************************/
	// HELPERS
	// scene.add(new DirectionalLightHelper(directional));
	// scene.add(new CameraHelper(directional.shadow.camera));
	// scene.add(new AxesHelper(5));
	
	// Event Handlers
	// HTML Elements
	const canvas= renderer.domElement;	// The canvas
	const nightChk= document.getElementById('night-chk');	// The night mode checkbox
	canvas.addEventListener('click', onClick);
	canvas.addEventListener('mousemove', onMouseMove);
	
	document.getElementById('change-view').addEventListener('click', onTurnChange);
	document.getElementById('reset-camera').addEventListener('click', onResetCamera);
	nightChk.addEventListener('change', () => {
		onNightModeToggle(nightChk.checked, ambient);
	});

	window.addEventListener('resize', onScreenResize);

	render();
}

init();