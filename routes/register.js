var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var connection = mysql.createConnection({
      host     : 'example.com',
      user     : 'example',
      password : 'example',
      database : 'example',
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
router.get('/', function(req, res) {
  res.render('register.html',{ message: req.flash('signupflash'), usererror: req.usererror});
});
router.post('/', function(req, res) {
  var nodemailer = require("nodemailer");
    var token = "";
    require('crypto').randomBytes(12, function(ex, buf) {
        token = buf.toString('hex');
        // create reusable transport method (opens pool of SMTP connections), used for email conformation 
        var smtpTransport = nodemailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "example@gmail.com",
                pass: "example"
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
				req.flash('signupflash','Username already in use.');
				res.redirect('/register');
			}
			else {
				var query = connection.query('INSERT INTO users SET ?', newBody, function(err, result) {
					response += err;
					response += result;
				});
				console.log(query.sql);
				console.log(response);
				res.redirect('/');
				var url  = "http://example.com/token?id=";
				url = url + token;
				// setup e-mail data with unicode symbols
				var mailOptions = {
					from: "Example <example@example.com>", // sender address
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
module.exports = router;