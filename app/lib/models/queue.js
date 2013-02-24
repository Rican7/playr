module.exports = function () {
	// Public properties
 	var upcomingSongs = [];
 	var playedSongs = [];

	return {
		addSong: function (song) {
			return upcomingSongs.push(song);
		},

		songFinished: function () {
			playedSongs.push(upcomingSongs[0]);
			this.removeSongAtIndex(0);
		},

		removeSongAtIndex: function(index) {
			upcomingSongs.splice(index, 1);
		},

		getSongs: function () {
			return upcomingSongs;
		},

		getPlayedSongs: function () {
			return playedSongs;
		}
	};
};
