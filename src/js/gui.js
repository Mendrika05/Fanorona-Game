// A module to provide the gui
import { Fog, PlaneGeometry, DoubleSide, BoxGeometry, MeshStandardMaterial, Mesh, TextureLoader, LinearFilter, DirectionalLight, AmbientLight } from 'three';	// The Needed Objects
import { AxesHelper, DirectionalLightHelper, CameraHelper } from 'three';	// Helpers
import { renderer, scene, camera,  control, COLORS, player1Color, player2Color } from './constants';	// Import the basic utilities
import { onClick, onScreenResize, onTurnChange, onResetCamera, onMouseMove, onNightModeToggle, changeColorPlayer1, changeColorPlayer2 } from './eventHandlers';
import Board from './Board';

const board= new Board();

function render() {
	// The render
	requestAnimationFrame(render);
	control.update();
	renderer.render(scene, camera);
}

const init= () => {
	// Initialization of the GUI

	// Renderer setup
	renderer.setSize(window.innerWidth, window.innerHeight / 1.2);	// Size
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
	scene.add(board);	// Add the Board
	board.init();	// Place the pieces
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
	// Reset the colorpicker elements
	player1Color.value= "#333333";
	player2Color.value= "#ffffff";
	const canvas= renderer.domElement;	// The canvas
	const nightChk= document.getElementById('night-chk');	// The night mode checkbox
	canvas.addEventListener('click', (event) => onClick(event, board));
	canvas.addEventListener('mousemove', (event) => onMouseMove(event, board));
	
	document.getElementById('change-view').addEventListener('click', onTurnChange);
	document.getElementById('reset-camera').addEventListener('click', onResetCamera);
	nightChk.addEventListener('change', () => {
		onNightModeToggle(nightChk.checked, ambient);
	});
	
	
	player1Color.addEventListener('change', () => {
		changeColorPlayer1();
		board.updateColor();
	});
	player2Color.addEventListener('change', () => {
		changeColorPlayer2();
		board.updateColor();
	});
 
	window.addEventListener('resize', onScreenResize);

	render();
}

init()