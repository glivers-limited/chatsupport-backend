var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config.json');
var executive = require('./api/executive');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'ssshhhhh',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));


//connecting to mongodb

if(config.mongo && config.mongo.dbuser && config.mongo.dbpassword) {
	console.log("Authentacting mongodb...");
	console.log("Not connected to mongodb...");
} else if(config.mongoUrl) {
	//mongoose.connect('mongodb://localhost/test');
	mongoose.connect(config.mongoUrl);
} else {
	console.log("mongo db component does not initlizez..");
}

var initPassport = require('./passport/init');
initPassport(passport);
var users = require('./api/users')(passport);

app.use('/executive', executive);
app.use('/users', users);

app.get('/', function(req, res, next) {
  if(req.session && req.session.user && req.session.user !== undefined) {
    var user = req.session.user;
    if(user.userType === 'executive') {
      res.sendFile(path.join(__dirname, '/views/executive.html'));
    } else if(user.userType === 'admin') {
      res.send(200, "comming soon");
    } else {
      res.send(200, user);
    }
  } else {
    res.sendFile(path.join(__dirname, '/views/index.html'));
  }
});

app.get('/*', function (req, res, next) {
  // body...
  //res.sendFile(path.join(__dirname, 'views/404.html'));
  res.send(404, {error:"Page not found on this server"});
});

http.listen(3000, function(){
  console.log('HTTP server started, listening on *:3000');
});


module.exports = app;
