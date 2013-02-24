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
// var twilioClient = require('twilio')('AC2857c4888d5cd547ff15d79c304dd5cd', '1cc7cda79d7db7a9642f1b6c7cf11dae');

// Internal libs
var inputSanitizer = require('./lib/input-sanitizer.js')();
var music = require('./lib/music.js')(rdio, Models);
var sms = require('./lib/sms.js')(twilioClient);
var playlist = new Models.queue();

// Add some prototype functions
String.prototype.clean = inputSanitizer.protoCleanQuery;

// Create our app
var app = express();
var cons = require('consolidate');
app.use(express.bodyParser());
app.use(express.static('assets'));
app.use(express.static(__dirname + '/views/partials'));

// assign the swig engine to .html files
app.engine('handlebars', cons.handlebars);
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

console.log(__dirname + '/views');
// app.register('.mustache', stache);

var hbs = require('hbs');

fs = require('fs')
fs.readFile(__dirname + '/views/partials/track.hbs', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
	hbs.registerPartial('track', data);
});


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

app.get('/', function(request, response) {
	response.render('index');
});

app.get('/play', function (request, response) {
	response.render('playlist.hbs', {
		tracks: playlist.getSongs()
	});
});

app.get('/token', function(request, response) {
	// Create our domain option
	var domain = request.query.host || 'playr.dev:5000';

	music.getPlaybackToken(domain, function( error, data ) {
		response.send( data );
	});
});

app.get('/playlist', function (request, response) {
	console.log(playlist.getSongs());

	response.send(playlist.getSongs());
});

app.get('/playlist/past', function (request, response) {
	console.log(playlist.getPlayedSongs());

	response.send(playlist.getPlayedSongs());
});

app.get('/track/search', function(request, response) {
	// Grab our params
	var searchQuery = (request.query.q || '').clean();
	var topOnly = typeof request.query.first !== 'undefined' ? true : false; // Make sure its boolean

	music.searchTrack( searchQuery, function( error, data ) {
		response.send( data );
	}, topOnly);
});

// app.get('/track/:key', function(request, response) {
// 	// Grab our params
// 	var trackKey = (request.param('key') || '').clean();
// 
// 	music.getTrackById( trackKey, function( error, data ) {
// 		response.send( data );
// 	});
// });

app.get('/track/add', function (request, response) {
	// Grab our params
	var searchQuery = (request.query.q || 'darwin deez').clean();
	console.log( searchQuery );
	
	// Find our track. Grab the first one.
	music.getTrackByQuery( searchQuery, function( error, data ) {
		console.log( data );

		// Did we get a response?
		if ( data !== null ) {
			// Add our song to our queue
			playlist.addSong(data);

			// Pass our track to our event subscribers
			io.sockets.emit('track-added', data);

			console.log(playlist.getSongs());

			response.send(playlist.getSongs());
		} else {
			response.send(404);
		}
	});
});

app.get('/track/remove/:id', function(request, response) {
	// Grab our params
	var trackId = parseInt((request.param('id') || 0), 10);

	// Remove our track from our playlist
	playlist.removeSongAtIndex(trackId);

	// Pass our event to our subscribers
	io.sockets.emit('track-removed', trackId);

	console.log(playlist.getSongs());

	response.send(playlist.getSongs());
});

app.get('/track/complete', function(request, response) {
	// Remove our track from our playlist
	playlist.songFinished();

	// Pass our event to our subscribers
	io.sockets.emit('track-complete');

	console.log(playlist.getSongs());

	response.send(playlist.getSongs());
});

app.post('/voice/', function(request, response) {
  response.send('Voice connection!');
});

app.post('/sms/reply/', function(request, response) {
	// Grab our params
	var sender = (request.body.From).clean();
	var searchParam = (request.body.Body).clean();

	console.log(request.body);

	// Find our track. Grab the first one.
	music.getTrackByQuery( searchParam, function( error, data ) {
		console.log( data );

		// Did we get a response?
		if ( data !== null ) {
			data.sender = sender;
			// Add our song to our queue
			playlist.addSong(data);

			// Pass our track to our event subscribers
			io.sockets.emit('track-added', data);

			// Set our success message
			var responseMessage = "Thanks for searching for " + searchParam + "! You just might hear your song soon. ;)";
		}
		else {
			// Set our fail message. :/
			var responseMessage = "Sorry, we couldn't find a track matching your search: " + searchParam;
		}

		// Send a response
		sms.incomingSms(sender, responseMessage, function (error, data) {
			if (error !== null) {
				console.log(error);
			}
		});
	});
});

var port = process.env.PORT || 5000;
server.listen(port);
// app.listen(port, function() {
//   console.log("Listening on " + port);
// });
