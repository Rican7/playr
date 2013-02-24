module.exports = function () {
	// Private properties
	var current = 0;

	// Public properties
 	this.songs = [];

	return {
		addSong: function (song, callback) {
			this.songs.push(song);
			callback(this);
		},
		removeSongAtIndex: function(index, callback) {
			this.songs.splice(index, 1);
			callback(this);
		}
	};
};
