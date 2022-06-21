import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let mainArray= [];

// Colors definitions
const COLORS= {
		WHITE: 0xffffff,
		GREY: 0x333333,
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
	mainArray
};