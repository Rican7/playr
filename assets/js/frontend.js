// Create our app closure
( function(context, $, undefined) {
	// App wide properties
	var playbackToken = null;
	var rdioControl = null;
	var socket = null;
	var templates = {};

	// Wait for our document to be ready
	$(document).ready(function() {
		// App-wide, jQuery dependent properties
		var $rdioEl = $('#rdio-wrapper');
		var $playlistEl = $('#playlist');
		var $templateFiles = $('script[type="text/x-handlebars-template"]');

		// Load all of our templates
		$templateFiles.each(function(idx, el) {
			$.get(el.src, function(data) {
				// Add our template data to our templates array
				templates[el.id] = data;
			});
		});

		// Let's get our playback token
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
		socket = io.connect(document.location.origin); // Connect to our own server

		// When our Rdio client is ready...
		$rdioEl.bind('ready.rdio', function(ev, userInfo) {
			// Grab our track template and compile it
			var trackTemplate = templates['template-track'];
			var template = Handlebars.compile(trackTemplate);

			// Create some bindings
			$rdioEl.bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
				console.log(playingTrack);
				if (playingTrack) {
					$('#currentArt').attr('src', playingTrack.icon);
					$('#currentTrack').text(playingTrack.name);
					$('#currentArtist').text(playingTrack.artist);
					rdioControl.play();
				}
			});

			$('#next').click(function() {
				// Play the next song
				rdioControl.next();

				// Grab our current key
				$.getJSON( '/track/complete', function(data) {
					//
				});
			});

			$('#play_pause').click(function() {
				console.log(rdioControl);
				rdioControl.play();
			});

			// Grab our current key
			$.getJSON( '/playlist', function(data) {
				if (data.length > 0) {
					for (var song in data) {
						// Queue up our song
						rdioControl.queue(data[song].key);

						// // Render our template with our data
						// var rendered = template( data[song] );

						// // Append our track view to our playlist view
						// $playlistEl.append( rendered );
					}

					// Play our first song
					// rdioControl.playQueuedTrack(0);
					rdioControl.play();

				}
			});

			/**
			 * Listen for our socket events
			 */

			// Track create
			socket.on('track-added', function(data) {
				console.log(data);
				rdioControl.queue(data.key);

				// Render our template with our data
				var rendered = template( data );

				// Append our track view to our playlist view
				$playlistEl.append( rendered );
			});

			// Track completed
			socket.on('track-complete', function(data) {
				//
			});

			// Track remove
			socket.on('track-removed', function(data) {
				console.log(data);

				// Remove from our queue
				rdioControl.removeFromQueue(data);

				// Remove the item from our visual playlist
				$playlistEl.eq(data).remove();
			});

			// Test
			// rdioControl.play('t2927188');

		});
	});
})( window.playrApp = {}, jQuery);
