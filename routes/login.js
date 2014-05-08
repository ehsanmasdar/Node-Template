var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var crypto = require('crypto');
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
    var passHash = require('password-hash');
    var connect = connection.query('SELECT * FROM users WHERE username = \'' + username + '\'', function(err,rows,fields){
      console.log(connect.sql);
      if (!rows || !rows[0]) {
        return done(null, false, req.flash('signinflash','Incorrect username or password.'));
      }
      if (!passHash.verify(password, rows[0].password)) {
        return done(null, false, req.flash('signinflash','Incorrect username or password.'));
      }
      return done(null, {id: rows[0].id , username: username}); //TODO: ID IMPLEMENTATION!!!!!!!
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var connect = connection.query('SELECT * FROM users WHERE id = \'' + id + '\'', function(err,rows,fields){
    done(err, {id : id, username : rows[0].username});
  });
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('login.html',{ message: req.flash('signinflash') });
});
router.get('/register', function(req, res) {
  res.render('register.html');
});
//Form
router.post('/register/submit', function(req, res) {
  var passHash = require('password-hash');
  req.body.password = passHash.generate(req.body.password);
  req.body.confirmPass = null;
  var newBody = {
  username: req.body.username,
  realname: req.body.realname,
  password: req.body.password,
  updates: req.body.updates ? 1 : 0,
  email: req.body.email,
  id : passHash.generate(req.body.username)
  };
  var response = " "
  var query = connection.query('INSERT INTO users SET ?', newBody, function(err, result) {
      response += err;
	  response += result;
  });
  console.log(query.sql);
  console.log(response);
  res.send('Registration sucessful' + response);
  var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
    var token = "";
    require('crypto').randomBytes(48, function(ex, buf) {
         token = buf.toString('hex');
         var smtpTransport = nodemailer.createTransport("SMTP",{
         service: "Gmail",
        auth: {
            user: "duedatesstaff@gmail.com",
            pass: "lasa2k16"
        }
        });
        var url  = "http://duedates.ehsandev.com/token?";
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

    });
});
router.post('/', passport.authenticate('local', { successRedirect: '/profile',
                                                    failureRedirect: '/login', 
                                                    failureFlash: true }));
module.exports = router;
