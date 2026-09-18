console.log('game.js loaded');

function getUserId() {
	const key = 'game_user_id';

	let id = localStorage.getItem(key);

	if (!id) {
		// id = crypto.randomUUID(); // only works in HTTPS contexts
		id = ([1e7]+-1e3+-4e3+-8e3+-1e18).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
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
	const resourceLowercase = resource.toLowerCase();
	return abbreviations[resourceLowercase];
}

async function buyResource(resource) {
	const request = {
		resource: getDBCol(resource),
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
	loadStats();
}

const userCookie = getUserId();
init();

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

function getLocalResource(resource) {
	return document.getElementById(resource).textContent;
}

function getStats() {
	const payload = {
		chickens: getLocalResource('chickens'),
		coops: getLocalResource('coops'),
		workers: getLocalResource('workers'),
		traders: getLocalResource('traders'),
		money: getLocalResource('money'),
		eggs: getLocalResource('eggs')
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
	loadStats();
}

async function sellEggs() {
	lastSellTimestamp = Date.now();
	if (getLocalResource('traders') < 1) {
		console.log('Need at least 1 trader to sell eggs');
		return;
	} else if (getLocalResource('eggs') < 12) {
		console.log('not at least a dozen eggs to sell yet');
		return;
	}
	const payload = {
		userId: userCookie
	};
	try {
		const resp = await fetch('/sellEggs', {
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)

		});
		const data = await resp.json();
		console.log(data);
		document.getElementById('eggs').textContent = data.eggs;
		document.getElementById('money').textContent = data.money;


	} catch (e) {
		console.log(e.message);
	}
	console.log("sent sellEggs request from front-end");
	saveStats();
}

async function loadStats() {
	lastSaveTimestamp = Date.now();
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
}

let lastSaveTimestamp = Date.now();
let lastSellTimestamp = Date.now();

let initialEggs = 0;
let localChickens = 0;

function getElapsedSecsSince(storedTimestamp) {
	const currentTimestamp = Date.now();
	const elapsedMs = currentTimestamp - storedTimestamp;
	const elapsedSecs = Math.floor(elapsedMs / 1000);
	return elapsedSecs;
}

function countUp() {
	const eggs = document.getElementById("eggs");
	const secondsSinceSave = getElapsedSecsSince(lastSaveTimestamp); 
	const freshEggs = initialEggs + secondsSinceSave * localChickens; // calculate 1egg/sec/chicken + database chickens value
	eggs.textContent = `${freshEggs}`;
	const secondsSinceSell = getElapsedSecsSince(lastSellTimestamp); 
	const sell_timer = document.getElementById("sell-timer");
	const sell_timer_progress = Math.min(Math.floor(secondsSinceSell), 10); // divide by sell-timer seconds * 10 (cancels out); cap progress to 100%
	let fullProgressBar = '||||||||||';
	let emptyProgressBar = '----------';
	sell_timer.textContent = '[' + fullProgressBar.slice(0, sell_timer_progress) + emptyProgressBar.slice(0, 10-sell_timer_progress) + ']';
	// if 30s have passed since storedSaveTimestamp
	//   save
	//   calculate elapsedSeconds = currentTimestamp - last saveTimestamp
	//   set the new stored savetimestamp (so 30s from now another save happens
	//   load
	// make it so that when buying, money is deducted according to resource bought
	//
	// if 10s have passed from storedsellEggTimestamp
	//   sell Eggs api endpoint (api gets eggs and gets workers and , calculates math , updates money , 
	//     eggs api endpoint runs load after it receives 200 ok response
	//   set new stored sellEggTimestamp (so 10s from now another sellEggs happens)
	//   
	if (secondsSinceSave > 30) {
		saveStats(); // triggers load, which refreshes the currentTimestamp; so this will loop every 30 elapsedSeconds
	}

	if (secondsSinceSell > 10) {
		sellEggs(); // triggers load, which refreshes the currentTimestamp; so this will loop every 30 elapsedSeconds
	}
	requestAnimationFrame(countUp);
}

requestAnimationFrame(countUp);
loadStats();
