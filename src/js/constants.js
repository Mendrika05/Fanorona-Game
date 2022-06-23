import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let player1Color= document.getElementById('player-1');
let player2Color= document.getElementById('player-2');
let turn= 1;

// Colors definitions
const COLORS= {
		PLAYER1: 0x333333,
		PLAYER2: 0xffffff,
		SELECTION: 0xE4D814,
		BOARD: 0x83390D,
		NIGHT: 0x0B0848,
		DAY: 0xF5CD6
	};


const renderer= new WebGLRenderer({
	canvas: document.getElementById('canvas'),
});	// Renderer
const scene= new Scene();	// Scene
const camera= new PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 1.2), 0.5, 100);	// Camera

const control= new OrbitControls(camera, renderer.domElement);	// The controls

export {
	COLORS,
	scene,
	renderer,
	camera,
	control,
	player1Color,
	player2Color,
	turn
};