console.log('game.js loaded');

function getUserId() {
	const key = 'game_user_id';

	let id = localStorage.getItem(key);

	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(key, id);
		console.log(`Generated new game_user_id: ${id}`);
	} else {
		console.log(`Found existing game_user_id: ${id}`);
	}
}

getUserId();

let storedTimestamp = Date.now();

function countUp() {
	const counter = document.getElementById("counter");
	const currentTimestamp = Date.now();
	const elapsedMs = currentTimestamp - storedTimestamp
	const elapsedSecs = Math.floor(elapsedMs / 1000);
	counter.textContent = `${elapsedSecs}s`;

	requestAnimationFrame(countUp);
}

requestAnimationFrame(countUp);
