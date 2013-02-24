var _ = require("underscore");

module.exports = function () {
 	this.songs = [];
	var current = 0;
	return {
		addSong: function (song, callback) {
			this.songs.push(song);
			callback(this);
		}

		removeSongAtIndex: function(index, callback) {
			this.songs.splice(index, 1);
			callback(this);
		}
	};
};