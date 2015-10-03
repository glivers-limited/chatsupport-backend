var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/Users');

module.exports = function(passport){
    
	passport.use('local', new LocalStrategy({
            passReqToCallback : true
        },
        function(username, password, done) {
    // asynchronous verification, for effect...
        process.nextTick(function () {
          findByUsername(username, function(err, user) {
        console.log('in auth function');
          return done('errortest');
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Unknown user ' + username });
            }
            if (user.password != password) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
          })
        });
      })
    );
}