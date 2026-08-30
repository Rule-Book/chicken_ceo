const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('better-sqlite3');


const app = express();
const DB_PATH = process.env.DB_PATH || 'game.db';
const PORT = process.env.PORT || 3000;

//serve everything in the public folder
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`);
});

const db = new sqlite3('game.db', { verbose: console.log }); // optional, for logs

// create table if needed
db.exec(`
  CREATE TABLE IF NOT EXISTS game_state (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    game_user_id    TEXT UNIQUE,
    last_save_time  TEXT,
    chickens        INTEGER DEFAULT 0,
    coops           INTEGER DEFAULT 0,
    workers         INTEGER DEFAULT 0,
    traders         INTEGER DEFAULT 0,
    money           INTEGER DEFAULT 0,
    eggs            INTEGER DEFAULT 0
  )
`);

// function getUserId() {
// 	const key = 'game_user_id';
// 
// 	let id = localStorage.getItem(key);
// 
// 	if (!id) {
// 		id = crypto.randomUUID();
// 		localStorage.setItem(key, id);
// 		console.log(`Generated new game_user_id: ${id}`);
// 		return id;
// 	} else {
// 		console.log(`Found existing game_user_id: ${id}`);
// 	}
// }
// 
// const userCookie = getUserId();

// get user id and display values 
// create user id with default values in db if it doesn't exist
// 1. check db for user
// 2. return values in array to display in javascript string
// 3. if row doesn't exist, create row and return default values

app.get('/initializeUser', (req, res) => {
    const userQuery = db.prepare("SELECT * FROM game_state WHERE game_user_id IS ?");
    // const user = userQuery.get(userCookie);
    // hardcoded cookie to test undefined response
    const user = userQuery.get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
    console.log('loading user');
    
    // create row with default values if user is not in table
    if (user == undefined) {
    	console.log("user does not exist:");
    	// console.log(userCookie);
    	let createDefaultUser = db.prepare(`
    		INSERT INTO game_state (game_user_id, last_save_time)
    		VALUES (?, datetime('now'))
    	`);
    	createDefaultUser.run('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	console.log('created user');
    } else {
	console.log('found user');
	let updateLoginTime = db.prepare(`
    		UPDATE game_state 
		SET last_save_time = datetime('now')
    		WHERE game_user_id IS ?
    	`);
    	updateLoginTime.run('666361b0-0fbc-4922-9fd4-8d6e298204b5');

    }
});


app.get('/loadStats', (req, res) => {
    const userQuery = db.prepare("SELECT * FROM game_state WHERE game_user_id IS ?");
    // const user = userQuery.get(userCookie);
    // hardcoded cookie to test undefined response
    const user = userQuery.get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
    console.log('loading user');
    
    // create row with default values if user is not in table
    if (user == undefined) {
    	console.log("user does not exist:");
    	// console.log(userCookie);
    	console.log('created user');
    } else {
    	let loadUserStats = db.prepare(`
    		SELECT chickens, coops, workers, traders, money, eggs FROM game_state WHERE game_user_id IS ?
    	`);
    	const stats = loadUserStats.get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	if (!stats) return res.status(404).json({ error: 'No user found' });
	console.log('found user');
	    console.log(stats);
	    console.log("passing to front-end");
	res.json({ok: true, ...stats });
    }
});

app.post('/saveStats', (req, res) => {
	const {chickens, coops, workers, traders, money, eggs, userId } = req.body;
	console.log('received stats for user', userId);
	console.log({ chickens, coops, workers, traders, money, eggs });
	const userQuery = db.prepare(`
		UPDATE game_state
		SET 	chickens = ?, 
			coops = ?,
			workers = ?,
			traders = ?,
			money = ?,
			eggs = ?
		WHERE game_user_id IS ?`);
	userQuery.run(chickens, coops, workers, traders, money, eggs, userId);
	console.log('saved stats for user', userId);
	res.json({ ok: true});
});

const traderVolume = 12; //traders always sell a dozen
const pricePerDozen = 24;
app.post('/sellEggs', (req, res) => {
	//split off to syncEggs fn later?
	let lastSync = db.prepare(`
		SELECT last_save_time
		FROM game_state
		WHERE game_user_id IS ?
		`).get('666361b0-0fbc-4922-9fd4-8d6e298204b5')/*.last_save_time + 'Z' ).getTime()*/;
	console.log(lastSync);
	lastSync = lastSync.last_save_time;
	console.log(lastSync);
	lastSync = lastSync + 'Z';
	console.log(lastSync);
	lastSync = new Date(lastSync);
	console.log(lastSync);
	lastSync = lastSync.getTime();
	console.log(lastSync);
	const chickens = db.prepare(`
		SELECT chickens
		FROM game_state
		WHERE game_user_id IS ?
		`).get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	const eggs = db.prepare(`
		SELECT eggs
		FROM game_state
		WHERE game_user_id IS ?
		`).get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	console.log(eggs.eggs);
	console.log(chickens.chickens);
	console.log(Date.now());
	console.log(lastSync);
	console.log(Date.now() - lastSync);
	const updatedEggs = eggs.eggs + chickens.chickens * 1 /*egg per sec*/ * Math.floor((Date.now() - lastSync) / 1000);
	console.log(updatedEggs);
	/* end syncEggs snippet */
	const { userId } = req.body;
	console.log(userId);
	db.prepare(`
		UPDATE game_state
		SET eggs = ?
		WHERE game_user_id IS ?
		`).run(updatedEggs, '666361b0-0fbc-4922-9fd4-8d6e298204b5');
	const tradersquery = db.prepare(`
		SELECT traders
		FROM game_state
		WHERE game_user_id IS ?
		`);
	const traders=tradersquery.get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	const money = db.prepare(`
		SELECT money
		FROM game_state
		WHERE game_user_id IS ?
		`).get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	console.log(traders.traders);
	console.log(eggs);
	console.log(money);
	if (traders.traders < 1) {
		return res.status(400).json({
			error: `${traders} traders aren't enough to sell a dozen`
		});
	}

	if (eggs.eggs < 12) {
		return res.status(400).json({
			error: `${eggs} eggs aren't enough to sell a dozen`
		});
	}
	console.log(Math.floor(eggs.eggs/traderVolume));
	const dozensToSell = Math.min(Math.floor(eggs.eggs/traderVolume), traders.traders); // largest dozen amount of eggs traders have volume to handle
	console.log(dozensToSell);
	const revenue = money.money + dozensToSell * pricePerDozen;
	const remainingEggs = updatedEggs - dozensToSell * traderVolume;
	console.log(remainingEggs);
	console.log(revenue);
	console.log('Selling eggs');
	db.prepare(`
		UPDATE game_state
		SET eggs = ?,
		money = ?,
		last_save_time = datetime('now')
		WHERE game_user_id IS ?
		`).run(remainingEggs, revenue, userId);
	res.json({ok: true, eggs: remainingEggs, money: revenue});
});

const cost = {
	chickens: 40,
	coops: 300,
	workers: 100,
	traders: 500
};
app.post('/updateResource', (req, res) => {
	const ALLOWED_COLUMNS = new Set([
		'chickens',
		'coops',
		'workers',
		'traders',
		'eggs'
	]);
	let money = db.prepare(`
		SELECT money
		FROM game_state
		WHERE game_user_id IS ?
		`).get('666361b0-0fbc-4922-9fd4-8d6e298204b5');
	money = money.money;
	const {resource, amount, userId } = req.body;
	if (money < cost[resource]) {
		return res.status(400).json({
			error: `Insufficient funds to buy: '${resource}' ${money}/${cost[resource]}`
		});
	}
	console.log('received stats for user', userId);
	console.log({resource, amount, userId });
	if (!ALLOWED_COLUMNS.has(resource)) {
		return res.status(404).json({
			error: `Unknown column: '${resource}'`
		});
	}
	const sql = `
		UPDATE game_state
		SET    ${resource} = ${resource} + ?,
		    money = money - ?
		WHERE game_user_id IS ?`;
	const userQuery = db.prepare(sql);
	console.log('resource', resource);
	console.log('amount', amount);
	userQuery.run(/*resource, resource,*/ amount, cost[resource], userId);
	console.log('updated resource for user', userId);
	res.json({ ok: true});
});

