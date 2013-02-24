// Require our express app framework
var express = require('express');

// External libs
var spotify = require('spotify');

// Internal libs
var music = require('./lib/music.js')(spotify);

// Create our app
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  // response.send('Hello World!');

  // Test our lib
  music.testSearch( 'fader', function( error, data ) {
	  response.send( data );
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
