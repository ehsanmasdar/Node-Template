var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var connection = mysql.createConnection({
      host     : 'ehsandev.com',
      user     : 'duedates',
      password : 'lasa2k16',
      database : 'duedates',
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({ passReqToCallback : true},
  function(req,username, password, done) {
    
    var connect = connection.query('SELECT * FROM users WHERE username = \'' + username + '\'', function(err,rows,fields){
      console.log(connect.sql);
      if (!rows || !rows[0]) {
        return done(null, false, req.flash('signinflash','Incorrect username or password.'));
      }
      if (!bcrypt.compareSync(password, rows[0].password)) {
        return done(null, false, req.flash('signinflash','Incorrect username or password.'));
      }
      if (rows[0].verified != 1) {
        return done(null, false, req.flash('signinflash','You must verify your email before you can sign in.'));
      }
      return done(null, {id: rows[0].id , username: username, realname: rows[0].realname}); //TODO: ID IMPLEMENTATION!!!!!!!
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var connect = connection.query('SELECT * FROM users WHERE id = \'' + id + '\'', function(err,rows,fields){
    done(err, {id : id, username : rows[0].username, realname : rows[0].realname});
  });
});

/* GET users listing. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.render('login.html',{ message: req.flash('signinflash'), welcome: "Welcome back, " + req.user.realname , isauthed: true});
  }
  else {
    res.render('login.html',{ message: req.flash('signinflash'), welcome: "Please Sign in above", isauthed: false});
  }
});
router.post('/', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login', 
                                                    failureFlash: true }));
module.exports = router;