module.exports = function () {
	// Public properties
 	var upcomingSongs = [];
 	var playedSongs = [];

	return {
		addSong: function (song, callback) {
			upcomingSongs.push(song);
			callback(this);
		},

		songFinished: function (index) {
			playedSongs.push(upcomingSongs[0]);
			removeSongAtIndex(0);
		},

		removeSongAtIndex: function(index) {
			upcomingSongs.splice(index, 1);
		},

		getSongs: function () {
			return upcomingSongs;
		}
	};
};
