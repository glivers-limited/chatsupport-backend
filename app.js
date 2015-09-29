var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.json');
var routes = require('./api/index');
var users = require('./api/users');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.use('/', routes);
app.use('/users', users);
app.get('/*', function (req, res, next) {
  // body...
  //res.sendFile(path.join(__dirname, 'views/404.html'));
  res.send(404, {error:"Page not found on this server"});
});

http.listen(3000, function(){
  console.log('HTTP server started, listening on *:3000');
});


module.exports = app;
