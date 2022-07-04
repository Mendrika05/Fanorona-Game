/*
	MANAGES THE EVENTS ON THE BOARD
*/
import { Raycaster, Vector2 } from 'three';
import { renderer, camera } from './constants';

let width= window.innerWidth / 1.2, height= window.innerHeight / 1.01;	// Canvas size
const rayCaster= new Raycaster();

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
	}
}

export {
	onBoardClick,
}