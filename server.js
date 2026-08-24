const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('better-sqlite3');

const app = express();
const DB_PATH = process.env.DB_PATH || 'game.db';
const PORT = process.env.PORT || 3000;

//serve everything in the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

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
