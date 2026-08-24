const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//serve everything in the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
	console.log('listening on http://localhost:${PORT}');
});
