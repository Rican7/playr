// Require our express app framework
var express = require('express');

// Models
var Models = {
	queue: require('./lib/models/queue.js'),
	track: require('./lib/models/song.js')
};

// External libs
var _ = require('underscore');
// var stache = require('stache');
var rdio = require('./lib/rdio/rdio.js');
var twilioClient = require('twilio')('ACceb22beac0d0c3ca5337f63739a1fbe3', 'f6a772f1a1094b582eec2a91f0454a70');

// Internal libs
var music = require('./lib/music.js')(rdio, Models);
var sms = require('./lib/sms.js')(twilioClient);
var playlist = new Models.queue();

// Create our app
var app = express();
var cons = require('consolidate');
app.use(express.bodyParser());
app.use(express.static('assets'));

// assign the swig engine to .html files
app.engine('handlebars', cons.handlebars);
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

console.log(__dirname + '/views');
// app.register('.mustache', stache);


// Socket.io
var http = require('http')
  , server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('track-finish', function (data) {
    playlist.songFinished(0);
    console.log(playlist.getSongs());
  });

  socket.on('track-deny', function (songKey) {

  });
});

app.get('/add-track', function (request, response) {
  music.getTrackByQuery( "darwin deez", function( error, data ) {
    console.log( data );

    // Did we get a response?
    if ( data !== null ) {
      io.sockets.emit('track-create', data);
      playlist.addSong(data, function (vears) {
        console.log(playlist.getSongs());
      });
      response.send(data);
    } else {
      response.send(404);
    }
  });
});

app.get('/', function(request, response) {
	response.render('index');
});

app.get('/play', function(request, response) {
	response.render('playlist');
});

app.get('/playlist', function (request, response) {
  response.render('playlist.hbs', {
    tracks: playlist.getSongs()
  });
});

app.get('/token', function(request, response) {
	// Create our domain option
	var domain = 'playr.metroserve.me';

	music.getPlaybackToken(domain, function( error, data ) {
		response.send( data );
	});
});

app.get('/track/search', function(request, response) {
	// Grab our params
	var searchQuery = request.query.q || '';
	var topOnly = typeof request.query.first !== 'undefined' ? true : false; // Make sure its boolean

	music.searchTrack( searchQuery, function( error, data ) {
		response.send( data );
	}, topOnly);
});

app.get('/track/:key', function(request, response) {
	// Grab our params
	var trackKey = request.param('key') || '';

	music.getTrackById( trackKey, function( error, data ) {
		response.send( data );
	});
});

app.post('/voice/', function(request, response) {
  response.send('Voice connection!');
});

app.post('/sms/reply/', function(request, response) {
	// Grab our params
	var sender = request.body.From;
	var searchParam = request.body.Body;

	console.log(request.body);

	// Find our track. Grab the first one.
	music.getTrackByQuery( searchParam, function( error, data ) {
		console.log( data );

		// Did we get a response?
		if ( data !== null ) {
      io.sockets.emit('track-create', data);
			// Set our success message
			var responseMessage = "Thanks for searching for " + searchParam + "! You just might hear your song soon. ;)";
		}
		else {
			// Set our fail message. :/
			var responseMessage = "Sorry, we couldn't find a track matching your search: " + searchParam;
		}

    // Send a response
    sms.incomingSms(sender, responseMessage, function (error, data) {

    });
	});
});

var port = process.env.PORT || 5000;
server.listen(port);
// app.listen(port, function() {
//   console.log("Listening on " + port);
// });
