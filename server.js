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



const WorldBuilder = require('./server/helpers/worldBuilder');
const WorldSimulator = require('./server/worldSimulator');

var server = serv.listen(app.get('port'), function() {
    console.log('listening on port ', server.address().port);
});

io.on("connection", function(socket) {
    console.log("connectedd");
});

let worldBuilder = new WorldBuilder();
var world = worldBuilder.create();
var worldSimulator = new WorldSimulator(world);
worldSimulator.start();