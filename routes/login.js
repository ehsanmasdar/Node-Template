var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var crypto = require('crypto');
var connection;
if (typeof process.env.OPENSHIFT_NODEJS_PORT != "undefined"){
    connection = mysql.createConnection({
      host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
      user     : 'adminlyjUE1R',
      password : 'nnLHs3XMiatd',
      database : 'nodejs',
    });
}
else{
    connection = mysql.createConnection({
      host     : 'us-cdbr-east-05.cleardb.net',
      user     : 'bff2e14a87c6fd',
      password : '1c2bd241',
      database : 'heroku_20112ec37c851b9',
    });
}

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
  var query = connection.query('INSERT INTO users SET ?', newBody, function(err, result) {
  });
  console.log(query.sql);
  res.send('Registration sucessful');
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

router.post('/submit', function(req, res) {
    console.log("request");
    var passHash = require('password-hash');
    var connect = connection.query('SELECT * FROM users WHERE username = \'' + req.body.username + '\'', function(err,rows,fields){
      console.log(connect.sql);
       if(err) throw err; 
       if(rows[0] && rows[0].username == req.body.username && passHash.verify(req.body.password, rows[0].password)){
           res.send('Login Sucessful');
       }
       else{
           res.send('Login Failed');
       }
    });
    
});

module.exports = router;
