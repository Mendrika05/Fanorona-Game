/*
	FUNCTIONS TO MOVE PIECES ON THE BOARD
	As we use an array, the positions will be given as follow:
		- up: -9
		- down: +9
		- left: -1
		- right: +1
	We return null when we reach the end of the board
*/
// Fundamental moves
function up(index, step= 1) {
	if (index == null)
		return null;

	if(index < 9)
		return null;	// Return to null
	if (step == 1)
		return index - 9;
	return up(up(index, step - 1), 1);
}

function down(index, step= 1) {
	if (index == null)
		return null;

	if(index + 9 > 44)
		return null;	// Return to null
	if (step == 1)
		return index + 9;
	return down(down(index, step - 1), 1);
}

function left(index, step= 1) {
	if (index == null)
		return null;

	let col= index % 9;	// Get the column number
	if (col - 1 < 0)
		return null;
	if (step == 1)
		return index - 1;
	return left(left(index, step - 1), 1);
}

function right(index, step= 1) {
	if (index == null)
		return null;

	let col= index % 9;	// Get the column number
	if (col + 1 > 8)
		return null;
	if (step == 1)
		return index + 1;
	return right(right(index, step - 1), 1);
}

// Diagonal moves are only commbinations of the basic linear moves
function upperLeft(index, step= 1) {
	return up(left(index, step), step);
}

function upperRight(index, step= 1) {
	return up(right(index, step), step);
}

function lowerLeft(index, step= 1) {
	return down(left(index, step), step);
}

function lowerRight(index, step= 1) {
	return down(right(index, step), step);
}

// To move around in the array given an index and a step
const Mover= {
	cross: (index, step= 1) => {
		return [
			up(index, step), down(index, step),	// Vertical
			left(index, step), right(index, step)	// Horizontal
		];
	},
	diagonal: (index, step= 1) => {
		return [
			upperLeft(index, step), lowerRight(index, step),	// Left from bottom to top
			upperRight(index, step), lowerLeft(index, step)	// Right from bottom to top
		];
	}
}

export {
	up, down, left, right, upperLeft, upperRight, lowerLeft, lowerRight, Mover
}