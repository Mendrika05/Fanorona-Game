/*
	MANAGES THE EVENTS ON THE BOARD
*/
import { Raycaster, Vector2 } from 'three';
import { renderer, scene, camera, COLORS, inGame } from './constants';

let width= window.innerWidth / 1.2, height= window.innerHeight / 1.01 - 50;	// Canvas size by default
let mousemove= new Vector2();	// To track mouse moves
const rayCaster= new Raycaster();

// WINDOW EVENTS
const onScreenResize= (game) => {
	// Help resize the screen for more responsivity
	// Screen size
	width= window.innerWidth / (game.inGame? 1: 1.2);
	height= window.innerHeight / 1.01 - 50;	// Takeout the 60 pixels for the thing

	renderer.setSize(width, height);

	camera.aspect= width / height;	// Aspect
	camera.updateProjectionMatrix();	// Because camera's property has been updated
	
	renderer.render(scene, camera);	// Render
}

// MOUSE EVENTS
const onBoardClick= (event, game) => {
	// Event when clicking on the board
	let click= new Vector2((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);	// To save the click's coordinates with normalized values

	/*
		Get the first element clicked which can be:
			- Selecting a piece for the player having the actual turn (1: player 1, -1: player 2)
			- A move on a droppable area
			- A capturable piece in a case of multiple capture possibilities
	*/

	// Use the raycaster
	rayCaster.setFromCamera(click, camera);
	const inters= rayCaster.intersectObjects(game.board.children);

	if (inters.length) {	// If it intersected something
		let obj= inters[0].object;	// Get the intersected object
		if (obj.isPiece && obj.movable) {	// Selection, movable is a piece property set by the game
			// Obj is a piece
			game.setActual= obj;
		}
		else if (obj.userData.canDropHere) {	// Piece drop
			game.drop(obj);	// Drop the actual piece
			// game.actual.drop(obj);	// Pass the object to allow the dropping on the exact point
		}
		else if (obj.isPiece && obj.capturable) {
			// In case of a capture conflict, we need to choose
			game.choose(obj);	// Choose and capture the piece
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
	if (found.length) {
		intersection= found[0];
		if (intersection.object.isPiece && (intersection.object.movable || intersection.object.capturable) || intersection.object.userData.canDropHere) {
			// If it's a piece, a droppable area or a capturable piece
			renderer.domElement.style.cursor= 'pointer';
		}
		else {
			renderer.domElement.style.cursor= 'default';
		}
	}
}

const onTurnEnd= (game) => {
	// To end one's turn
	game.swapTurn();
	document.getElementById('curplcol').style.backgroundColor= (this.turn==1?COLORS.PLAYER1:PLAYER2);
}

const updatePieceColor= (player, game) => {
	let input=  document.getElementById(`player-${player == 1? 1: 2}`);// Get the correct input
	let color= input.value;	// Get the color
	// Filter the colors
	// It can't be the capturable or selection color
	if (color == COLORS.CAPTURABLE || color == COLORS.SELECTION) {
		alert("Please choose another color as this one is identic to a game constant");
		input.value= player == 1? COLORS.PLAYER1: PLAYER2;	// Reset the initial value
		return;	// End the function
	}
	// Update the color in the COLORS thingy
	if (player == 1) {
		// Player 1
		// Filter the color
		if (COLORS.PLAYER2 == color) {
			alert("Players can't have the same color of piece");
			input.value= player == 1? COLORS.PLAYER1: COLORS.PLAYER2;	// Reset the initial value
			return;
		}
		COLORS.PLAYER1= color;
	}
	else {
		// Player 2
		// Filter the color
		if (COLORS.PLAYER1 == color) {
			alert("Players can't have the same color of piece");
			input.value= player == 1? COLORS.PLAYER1: COLORS.PLAYER2;	// Reset the initial value
			return;
		}
		COLORS.PLAYER2= color;
	}
	game.updateColor();	// Update the color on the board game
}

export {
	onBoardClick,
	onMouseMove,
	onScreenResize,
	onTurnEnd,
	updatePieceColor
}