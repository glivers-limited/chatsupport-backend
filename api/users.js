var express = require('express');
var router = express.Router();
var Users = require('./../models/Users');
var mailSender = require('./../mailSender.js');

module.exports = function (passport) {

	/* GET users listing. */
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});

	/**
	 * creating user
	 * @paran: None
	 * @reurn: Boolean
	 */
	router.get('/isLogined', function(req, res, next) {
	  if(req.session && req.session.user) {
	  	res.send(200,{isLogined:true, user:req.session.user});
	  } else {
	  	res.send(200,{isLogined:false});
	  }
	});

	/**
	 * creating user
	 * @paran: Object
	 * @reurn: Object
	 */

	router.post('/create', function (req, res, next) {
		Users.saveUser(req.body, function (err, user) {
			if(err) {
				console.log(err);
				res.send(200, {success:false, err:err});
			} else if(user) {
				mailSender.sendEmailVerificationMail(user, function (status) {
					console.log(status);
				});
				res.send(200, {success:true, user:user});
			} else {
				res.send(200, {success:false, err: "Please try again"});
			}
		});
	});

	/**
	 * login user
	 * @paran: Object
	 * @reurn: Object
	 */

	router.post('/login', function (req, res, next) {
		if(!req.body.email) return res.send(200, {success:false, err:"email id missing"});
		else if(!req.body.password) return res.send(200, {success:false, err:"password missing"});
		else Users.findOneByProp({email:req.body.email}, function (err, user) {
				if(err) {
					res.send(200, {success:false, err:err});
				} else if(user) {
					if(user.password === req.body.password) {
						req.session.user = user;
						req.session.save();
						return res.send(200, {success:true, user:user});
					} else 
						res.send(200, {success:false, err:"invalid email or password"});
				} else {
					res.send(200, {success:false, err: "invalid email or password"});
				}
			});
	});

	/**
	 * verify email
	 *
	 */

	 router.get('/verify-email/:emailVerificationCode', function (req, res, next) {
	 	// body...
	 	Users.findOne({emailVerificationCode:req.param('emailVerificationCode')}, function (err, user) {
	 		if(err) {
	 			res.send(200, {success:false, err: "Your request cann't be processed because of techenical fault."});
	 		} else if(user) {
	 			Users.update({_id:user._id}, {isEmailVerified:true}, function (err) {
	 				if(err) {
			 			res.send(200, {success:false, err: "Your request cann't be processed because of techenical fault."});
			 		} else {
			 			res.send(200, {success:true, message:"your email verified successfully"});
			 		}
	 			});
	 		} else {
	 			res.send(200, {success:false, err: "Invalid email verification."});
	 		}
	 	});
	});
	 return router;
}
