/**
 * Export our lib
 */
module.exports = function() {
	var errors = [];

	this.add = function(error) {
		 this.errors.push(error);
	 };

	// Return our module instance
	return this;
}
