var path = require('path');
var express = require('express');
var app = express();

var serv = require("http").createServer(app);
var io = require('socket.io')(serv, {});

app.use("/js", express.static(__dirname + '/build/js'));
app.use("/assets", express.static(__dirname + '/build/assets'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/build/index.html');
});


app.set('port', process.env.PORT || 8080);


var server = serv.listen(app.get('port'), function() {
    console.log('listening on port ', server.address().port);
});



// Game Server
const ServerEngine = require('./server/engines/serverEngine');
const GameEngine  = require( './server/engines/gameEngine');

// Game Instancess
const gameEngine = new GameEngine();
const serverEngine = new ServerEngine(io, gameEngine, {
    debug: {},
    updateRate: 6,
    timeoutInterval: 0 // no timeout
});

// start the game
serverEngine.start();

// let worldBuilder = new WorldBuilder();
// var world = worldBuilder.create();
// var worldSimulator = new WorldSimulator(world);
// worldSimulator.start("asd");

// io.on("connection", function(socket) {
//     socket.on('hiFrom', function(clientName) {
//         world.addClient(socket, clientName);
//         console.log(socket.id + " | " + clientName + " said hii");

//     });

//     socket.on("disconnect", function() {
//         world.disconnectClient(socket.id);
//         console.log(socket.id + " is disconnected;");
//     });
// });