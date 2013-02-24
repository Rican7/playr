// var client;

// if (proccess.env.NODE_ENV == "production") {
// 	client = new TwilioClient(
// 		process.env.TWILIO_SID, 
// 		process.env.TWILIO_AUTH_TOKEN, 
// 		'http://tufts-playr.herokuapp.com'
// 		);
// } else {
// 	client = new TwilioClient(
// 		'ACceb22beac0d0c3ca5337f63739a1fbe3', 
// 		'f6a772f1a1094b582eec2a91f0454a70', 
// 		'http://localhost:5000'
// 		);
// }

module.exports = function(twilio) {
	// Return our module instance
	return {
		incomingSms: function(sender, body, callback) {
			// Send a response back to the sender
			twilio.sms.messages.post({
				to: sender,
				from: "+16032623095",
				body: "Thanks for searching for " + body + "!"
			}, function(error, data) {
		        callback(error, data);
			});
		}
	};
};
