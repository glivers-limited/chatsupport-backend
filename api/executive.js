var express = require('express');
var router = express.Router();
var Users = require('./../models/Users');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user && req.session.user !== undefined) {

  } else {
  	res.sendFile(path.join(__dirname, '../views/index.html'));
  }
});


router.get('/isLogined', function(req, res, next) {
  if(req.session && req.session.user) {
  	res.send(200,{isLogined:true, user:req.session.user});
  } else {
  	res.send(200,{isLogined:false});
  }
});


/**
 * login admin
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

module.exports = router;
