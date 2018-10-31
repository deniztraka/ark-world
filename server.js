var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/build/index.html');
});




app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
    console.log('listening on port ', server.address().port);
});