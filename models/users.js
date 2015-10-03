var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersSchema = new Schema({
	fname: {
		type:String,
		require:true,
		trim:true
	},
	lname: {
		type:String,
		require:true,
		trim:true
	},
	email: {
		type:String,
		require:true,
		trim:true
	},
	password: {
		type: String,
		require: true,
		trim: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	isEmailVerified: {
		type: Boolean,
		default: false
	},
	emailVerificationCode: {
		type: String,
		default: Math.random().toString(36).slice(2)
	},
	userType: {
		type:String,
		default:"user"
	}
});

//STATICS METHODS
// saveing user
usersSchema.statics.saveUser = function (userObj, cb) {
	if(!userObj.email || userObj.email === undefined || typeof userObj.email === undefined)
  		return cb("Invalid first name", null);
  	if(!userObj.fname || userObj.fname === undefined || typeof userObj.fname === undefined)
  		return cb("Invalid first name", null);
  	if(!userObj.lname || userObj.lname === undefined || typeof userObj.lname === undefined)
  		return cb("Invalid first name", null);
  	if(!userObj.password || userObj.password === undefined || typeof userObj.password === undefined)
  		return cb("Invalid first name", null);
  	var model = this;
  	this.findOneByProp({email:userObj.email}, function (err, user) {
  		// body...
  		if(err)
  			return cb(err, null);
  		else if(user)
  			return cb("email id already exist", null);
  		else 
  			model.generateMailverificationCode(function (code) {
  				userObj.emailVerificationCode = code;
  				return model.create(userObj, cb);
  			});
  	});
}

usersSchema.statics.findOneByProp = function (query, cb) {
	if(typeof query === 'object') {
		return this.findOne(query, cb);
	} else {
		cb("Invalid search query", null);
	}
}

//generating mail verification code
usersSchema.statics.generateMailverificationCode = function (cb) {
	//here will be random code gererator logic.
	cb(Math.random().toString(36).slice(2));
}


//METHODS

usersSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  return obj
}

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;