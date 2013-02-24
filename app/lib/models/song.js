module.exports = function () {
	// The sauce
	this.key = "";
	this.embedUrl = "";

	// Metadata
	this.name = "";
	this.artist = "";
	this.album = "";
	this.icon = "";
	this.baseIcon = "";

	// Misc.	
	this.albumKey = "";
	this.albumURL = "";
	this.artistKey = "";
	this.canStream = false;
	this.canSample = false;

	return {
		initialize: function (json) {
			Object.map(json, function(data){
				console.log(data);
			})
		}
	};
};