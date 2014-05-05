var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
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

passport.use(new LocalStrategy(
  function(username, password, done) {
    var passHash = require('password-hash');
    var connect = connection.query('SELECT * FROM users WHERE username = \'' + username + '\'', function(err,rows,fields){
      console.log(connect.sql);
      if (!rows[0]) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      if (!passHash.verify(password, rows[0].password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, {id: 0 , username: username}); //TODO: ID IMPLEMENTATION!!!!!!!
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
/* GET users listing. */
router.get('/', function(req, res) {
  res.render('login.html');
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
  email: req.body.email
  };
  var response = " "
  var query = connection.query('INSERT INTO users SET ?', newBody, function(err, result) {
      response += err;
  });
  console.log(query.sql);
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
router.post('/submit', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login', 
                                                    failureFlash: true }));
module.exports = router;
