/**
 * Export our library
 */
module.exports = function() {
	// Keep a reference to "us"
	var self = this;

	this.cleanQuery = function(queryString) {
		// Define our reg-ex
		var regEx = /'/g;

		return queryString.replace(regEx, '');
	};

	this.protoCleanQuery = function() {
		return self.cleanQuery( this.toString() );
	};

	// Return our module instance
	return this;
};
