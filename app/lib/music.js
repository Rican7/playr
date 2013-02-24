/**
 * Export our music library
 * (control what functions get exported to our app)
 */
module.exports = function(Rdio) {
	// Instanciate our music service
	var musicService = new Rdio(['r656xv8q7h2x34mvk3aarqzv', '7kFc8Hz9aH']);

	// Return our module instance
	return {
		/**
		 * Create a service wrapper,
		 * so we can check for errors and handle them gracefully
		 */
		serviceCall: function(apiMethod, options, callback) {
			// Make our API call with our music service
			musicService.call( apiMethod, options, function(error, data) {
				// Did we get an error?
				if (typeof error !== 'undefined' && error !== null) {
					console.log(error);
				}
				// Did we get data?
				else if (typeof data !== 'undefined' && data !== null) {
					// Was our status good?
					/*
					if (data.status === 'ok') {
						
					}
					*/
				}

				callback(error, data);
			});
		},
		searchTrack: function(query, callback, firstResultOnly) {
			// Search with our music service
			this.serviceCall( 'search',
				// Pass our params
				{
					types: 'Track',
					query: query
				},
				function(error, data) {
					// Parse our results
					if (typeof data.result.results !== 'undefined' && data.result.results !== null) {
						// Set our result data to just our results
						data = data.result.results;

						// If we only want our first result
						// Also, do a really hilarious javascript check to see if this is an array
						if (firstResultOnly === true && Object.prototype.toString.call( data ) === '[object Array]') {
							data = data[0];
						}
					}

					// Call our callback
					callback(error, data);
				}
			);
		},
		getTrack: function(query, callback) {
			this.searchTrack(query, callback, true);
		}
	};
};
