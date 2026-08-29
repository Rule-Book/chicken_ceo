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
	return id;
}

const abbreviations = {
	chicken: 'chickens',
	coop: 'coops',
	worker: 'workers',
	trader: 'traders',
	money: 'money',
	egg: 'eggs'
};

function getDBCol(resource) {
	const resource = resource.toLowerCase();
	return abbreviations[resource];
}

function buyChicken() {
	const request = {
		resource: getDBCol('chicken'),
		amount: 1,
		userId: userCookie
	};
	try {
		const resp = await fetch('/updateResource', {
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});
		const data = await resp.json();
		if (!data.ok) throw new Error(data.msg);
		console.log("Buy processed");
	} catch (e) {
		console.log(e.message);
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

function getStats() {
	const payload = {
		chickens: 10,
		coops: 5,
		workers: 1,
		traders: 30,
		money: 12345,
		eggs: 1
	};
	return payload;
}

async function saveStats() {
	let stats = getStats();
	stats.userId = userCookie;
	try {
		const resp = await fetch('/saveStats', {
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(stats)

		});
		const data = await resp.json();
	} catch (e) {
		console.log(e.message);
	}
	console.log("completed save on front-end");
}

async function loadStats() {
	let temp = 0;
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
	// store a local copy of the latest values from database to simulate game on client until next server sync
	localChickens = temp.chickens;
	initialEggs = temp.eggs;
	storedTimestamp = Date.now();
}

let storedTimestamp = Date.now();

let initialEggs = 0;
let localChickens = 0;
function countUp() {
	const eggs = document.getElementById("eggs");
	const currentTimestamp = Date.now();
	const elapsedMs = currentTimestamp - storedTimestamp
	const elapsedSecs = Math.floor(elapsedMs / 1000);
	const freshEggs = initialEggs + Math.floor(elapsedMs / 1000) * localChickens;
	eggs.textContent = `${freshEggs} eggs`;

	requestAnimationFrame(countUp);
}

requestAnimationFrame(countUp);
