// Create our app closure
( function(context, $, undefined) {
	// App wide properties
	var playbackToken = null;
	var rdioControl = null;
	var socket = null;

	// Wait for our document to be ready
	$(document).ready(function() {
		// App-wide, jQuery dependent properties
		var $rdioEl = $('#rdio-wrapper');

		// First, let's get our playback token
		$.getJSON( '/token?domain=' + document.location.hostname,
			// Success callback
			function(data) {
				// Set our token from our result
				playbackToken = data.result;

				// Init our Rdio client lib
				rdioControl = $rdioEl.rdio( playbackToken );
			}
		);

		// Connect to our socket.io connection
		socket = io.connect('/'); // Connect to our own server

		// When our Rdio client is ready...
		$rdioEl.bind('ready.rdio', function(ev, userInfo) {
			// Listen for a socket event
			socket.on('track-create', function(data) {
				console.log(data);
				rdioControl.play(data.key);
			});

			// Test
			// rdioControl.play('t2927188');
		});
	});
})( window.playrApp = {}, jQuery);
