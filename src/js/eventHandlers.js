import { Vector2, Raycaster } from 'three';
import { renderer, scene, camera, control, COLORS, player1Color, player2Color, turn } from './constants';

let width= window.innerWidth, height= window.innerHeight / 1.2;	// Canvas size
let rayCaster= new Raycaster();
let click= new Vector2(), mousemove= new Vector2();
let turn= -2;	// It is the next opposite direction
let actualPiece;

// WINDOW EVENT
const onScreenResize= () => {
	// Help resize the screen for more responsivity
	// Screen size
	width= window.innerWidth;
	height= window.innerHeight / 1.2;

	renderer.setSize(width, height);

	camera.aspect= width / height;	// Aspect
	camera.updateProjectionMatrix();	// Because camera's property has been updated
	
	renderer.render(scene, camera);	// Render
}

// BOARD EVENTS
const onClick= (e, board) => {
	// When a piece is clicked
	click.x= (e.clientX / width) * 2 - 1;
	click.y= - (e.clientY / height) * 2 + 1;

	rayCaster.setFromCamera(click, camera);

	const found= rayCaster.intersectObjects(board.children);

	// Recolor the old one
	if (board.actual) {
		board.actual.material.color.set(board.actual.value == 1? COLORS.GREY: COLORS.WHITE);
		if (board.actual.drop(found[1])){	// Drop
			board.actual= undefined;	
		}// Take focus out
	}
	else if (found.length && found[0].object.isPiece && found[0].object.value == board.turn) {
		board.actual= found[0].object;	// Set the actual piece
		if (board.check()) {	// After checking, we see if it is a valid move
			board.actual.select();	// Color it
		}
		else {			board.actual= undefined;
		}
	}
}

const onMouseMove= (e, board) => {
	// To change the cursor according to where it points in the canvas
	mousemove.x= (e.clientX / width) * 2 - 1;
	mousemove.y= - (e.clientY / height) * 2 + 1;

	rayCaster.setFromCamera(mousemove, camera);

	const found= rayCaster.intersectObjects(board.children);

	// Change pointer
	if (found.length && found[0].object.isPiece) {
		renderer.domElement.style.cursor= 'pointer';
	}
	else {
		renderer.domElement.style.cursor= 'default';
	}

	// Drag the selected piece
	if (board.actual) {
		if (found.length) {
			for (let intersection of found) {
				board.actual.drag(intersection);	// Drag the piece
			}
		}
	}
}

// CONTROLLERS
const onTurnChange= () => {
	// Turn the camera
	if (parseInt(camera.position.z) != parseInt(turn)) {
		requestAnimationFrame(onTurnChange);
		camera.position.x= camera.position.z * turn > 0? 0.2: 0.5;
		camera.position.y= 5;
		camera.position.z+= turn < 0? -0.1: 0.1;
		camera.updateProjectionMatrix();	// When changing the thing we need to set this
		renderer.render(scene, camera);
		control.update();	// Update only when done rendering
	}
	else {
		// Reset x position
		if (camera.position.x < 0) {
			// Finish
			camera.position.set(0, 5, turn)
			turn= -turn;	// Swap turn
		}
		else {
			// Still with animation
			requestAnimationFrame(onTurnChange);
			camera.position.x-= 0.01;	
		}
	}
}

const onResetCamera= (board) => {
	camera.position.set(0, 5, -board.turn);	// -turn is the current turn
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
} 

const onNightModeToggle= (nightMode, ambient) => {
	// Check for night mode
	if (nightMode) {
		// Night mode
		renderer.setClearColor(COLORS.NIGHT);
		ambient.color.set(0xaaaaaa);	// Set ambient light
	}
	else {
		// Day mode
		renderer.setClearColor(COLORS.DAY);
		ambient.color.set(0xffffff);	// Set ambient light
	}
}

const changeColorPlayer1= () => {
	COLORS.PLAYER1= player1Color.value;
}

const changeColorPlayer2= () => {
	COLORS.PLAYER2= player2Color.value;
}

export {
	onClick,
	onScreenResize,
	onTurnChange,
	onResetCamera,
	onMouseMove,
	onNightModeToggle,
	changeColorPlayer1,
	changeColorPlayer2,
	actualPiece
}