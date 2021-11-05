// Test TypeScript app using a Node server.

var path = require('path');
var express = require('express');

var app = express();

var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

app.listen(3000, function() {
    console.log('listening');
});

// To run:

// > npm install
// > tsc main.ts
// > tsc dieRoller.ts
// > node server.js

// Then goto localhost:3000 in a browser

// set NODE_PATH="C:\Users\mrtea\AppData\Roaming\npm\node_modules";%NODE_PATH%