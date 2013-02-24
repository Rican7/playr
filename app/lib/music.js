/**
 * Export our music library
 * (control what functions get exported to our app)
 */
module.exports = function(spotify) {
	// Return our module instance
	return {
		testSearch: function(query, callback) {
			// Search with our Spotify library
			spotify.search(
				// Pass our params
				{
					type: 'track',
					query: query
				},
				function(error, data) {
					// Call our callback
					callback(error, data);
				}
			);
		}
	};
};
