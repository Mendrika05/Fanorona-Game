import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let player1Color= document.getElementById('player-1');
let player2Color= document.getElementById('player-2');

// Colors definitions
const COLORS= {
		PLAYER1: "#333333",
		PLAYER2: "#ffffff",
		SELECTION: "#e4d814",
		BOARD: 0x83390D,
		TABLE: 0x432611,
		NIGHT: "#0B0848",
		DAY: "#0F5CD6",
		CAPTURABLE: "#990000"
	};


const renderer= new WebGLRenderer({
	canvas: document.getElementById('canvas'),
});	// Renderer
const scene= new Scene();	// Scene
const camera= new PerspectiveCamera(75, (window.innerWidth / 1.2) / (window.innerHeight / 1.01 - 50), 0.5, 100);	// Camera

const control= new OrbitControls(camera, renderer.domElement);	// The controls

export {
	COLORS,
	scene,
	renderer,
	camera,
	control,
	player1Color,
	player2Color,
};