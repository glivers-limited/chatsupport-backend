module.exports = function () {
	// body...
	var mongoose = require('mongoose');
	var config = require('./config.json');
	if(config.mongo && config.mongo.dbuser && config.mongo.dbpassword) {
		console.log("Authentacting mongodb...");
		console.log("Not connected to mongodb...");
	} else {
		//mongoose.connect('mongodb://localhost/test');
		console.log("dasdas");
		mongoose.connect(config.mongoUrl, function (err) {
			// body...
			if(err) console.log(err);
			else console.log("connected to mongodb...");
		});
	}
}