var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var connection;
connection = mysql.createConnection({
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
router.get('/register', function(req, res) {
  res.render('register.html',{ message: req.flash('signupflash')});
});
//Form
router.post('/register/submit', function(req, res) {
  var nodemailer = require("nodemailer");

    var token = "";
    require('crypto').randomBytes(12, function(ex, buf) {
        token = buf.toString('hex');
        // create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "duedatesstaff@gmail.com",
                pass: "lasa2k16"
            }
        });
        var salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        req.body.confirmPass = null;
        var newBody = {
            username: req.body.username,
            realname: req.body.realname,
            password: req.body.password,
            updates: req.body.updates ? 1 : 0,
            email: req.body.email,
            id : bcrypt.hashSync(req.body.username,salt),
            emailtoken: token,
            verified : 0
        };
        var response = " ";		
		var connect = connection.query('SELECT * FROM users WHERE username = \'' + req.body.username + '\'', function(err,rows,fields){
			console.log(connect.sql);
			if (rows && rows[0]) {
				res.redirect('register.html',{ message: req.flash('signupflash','You must verify your email before you can sign in.')});
			}
			else {
				var query = connection.query('INSERT INTO users SET ?', newBody, function(err, result) {
					response += err;
					response += result;
				});
				console.log(query.sql);
				console.log(response);
				res.redirect('/');
				var url  = "http://ehsandev.com:8080/token?id=";
				url = url + token;
				// setup e-mail data with unicode symbols
				var mailOptions = {
					from: "DueDateStaff <duedatesstaff@gmail.com>", // sender address
					to: req.body.email, // list of receivers
					subject: "Registration", // Subject line
					text: "Click on the following link to complete your registration", // plaintext body
					html: "<b>Click on the following link to complete your registration:</b>" + url // html body
				}
    
				// send mail with defined transport object
				smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
						console.log(error);
					}else{
						console.log("Message sent: " + response.message);
					}
					smtpTransport.close();
				});
			}
		});
        
    });
});
router.post('/', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login', 
                                                    failureFlash: true }));
module.exports = router;
