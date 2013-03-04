module.exports = function (json) {
	// The sauce
	this.key = "";
	this.embedUrl = "";

	// Metadata
	this.name = "";
	this.artist = "";
	this.album = "";
	this.icon = "";
	this.baseIcon = "";
	this.duration = 0;

	// Sender/Requester
	this.sender = "+19999999999";

	// Misc.		
	this.albumKey = "";
	this.albumUrl = "";
	this.artistKey = "";
	this.canStream = false;
	this.canSample = false;

	// Set our properties by our passed in data
	for (var prop in json) {
		if (this.hasOwnProperty(prop)) {
			this[prop] = json[prop];
		}
	}

	return this;
};
