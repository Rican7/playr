// Require our express app framework
var express = require('express');

// Models
var Models = {
	queue: require('./lib/models/queue.js'),
	track: require('./lib/models/song.js')
};

// External libs
var _ = require('underscore');
var stache = require('stache');
var rdio = require('./lib/rdio/rdio.js');

// Internal libs
var music = require('./lib/music.js')(rdio, Models);



// Create our app
var app = express.createServer(express.logger());
app.use(express.bodyParser());
app.use(express.static('assets'));
app.set('view engine', 'mustache');
app.set('view options', { layout: false });
app.register('.mustache', stache);

var twilioClient = require('twilio')('ACceb22beac0d0c3ca5337f63739a1fbe3', 'f6a772f1a1094b582eec2a91f0454a70');

app.get('/', function(request, response) {
	// response.send( 'hi!' );
	response.render('index');
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
	console.log(request.body);
	var sender = request.body.From;
	var searchParam = request.body.Body;

	twilioClient.sms.messages.post({
		to: sender,
		from: "+16032623095",
		body: "Thanks for searching for " + searchParam + "!"
	}, function(err, responseData) { //this function is executed when a response is received from Twilio

    	if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        	console.log(responseData.from); // outputs "+14506667788"
        	console.log(responseData.body); // outputs "word to your mother."

   		}
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
