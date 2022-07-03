import { Fog, DirectionalLight, AmbientLight } from 'three';	// The Needed Objects
import { AxesHelper, DirectionalLightHelper, CameraHelper } from 'three';	// Helpers
import Game from './Game';	// The game logic
import { onBoardClick } from './eventHandlers2';
import { renderer, scene, camera,  control, COLORS } from './constants';	// Import the basic utilities

function render() {
	// The render
	requestAnimationFrame(render);
	control.update();
	renderer.render(scene, camera);
}

const init= () => {
	// Initialization of the GUI

	// Renderer setup
	renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.01);	// Size
	renderer.setClearColor(COLORS.DAY);	// Renderer background
	renderer.shadowMap.enabled= true;	// Enable shadows

	// The scene
	scene.fog= new Fog(0x777777, 5, 100);	// Fog

	// The camera
	camera.position.set(0, 5, 2);

	// Orbit Controls
	// control.enabled= false;
	// control.enableZoom= false;	// No zooming

	/**************************************************************************************************************************/

	// THE BOARDS
	/********************************************************************************************************************/
	const game= new Game();
	/***************************************************************************************************************************/

	// LIGHTS
	/**************************************************************************************************************************/
	const ambient= new AmbientLight(0xffffff);	// Day mode by default
	const directional= new DirectionalLight(0xffffff, 1.5)
	scene.add(ambient);
	scene.add(directional);

	directional.castShadow= true;
	directional.position.set(-5, 4, -5);
	/**************************************************************************************************************************/
	// HELPERS
	// scene.add(new DirectionalLightHelper(directional));
	// scene.add(new CameraHelper(directional.shadow.camera));
	// scene.add(new AxesHelper(5));


	/********************************************* EVENT HANDLERS ******************************************************/
	let canvas= renderer.domElement;	// To make the process easier

	canvas.addEventListener('click', (e) => {
		onBoardClick(e, game);
	});

	render();	// Render the final results
}

init()