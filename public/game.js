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

const userCookie = getUserId();

async function init() {
	try {
		const resp = await fetch('/initializeUser', {method:'GET'});
		const data = await resp.json();
		if (!data.ok) throw new Error(data.msg);
		console.log("Init processed");
	} catch (e) {
		console.log(e.message);
	}
}

let temp = 0;
async function loadStats() {
	try {
		const resp = await fetch('/loadStats', {method:'GET'});
		const data = await resp.json();
		if (!data.ok) throw new Error(data.msg);
		console.log("Load processed");
		console.log(data);
		temp = data;
	} catch (e) {
		console.log(e.message);
	}
	console.log("completed load on front-end");
	document.getElementById('chickens').textContent = temp.chickens;
	document.getElementById('coops').textContent = temp.coops;
	document.getElementById('workers').textContent = temp.workers;
	document.getElementById('traders').textContent = temp.traders;
	document.getElementById('money').textContent = temp.money;
	document.getElementById('eggs').textContent = temp.eggs;
}

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
