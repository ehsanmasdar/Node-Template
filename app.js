var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');
var mysql      = require('mysql');
var crypto = require('crypto');
var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
  user     : 'adminlyjUE1R',
  password : 'nnLHs3XMiatd',
  database : 'nodejs',
});
connection.connect(function(err) {
  // connected! (unless `err` is set)
});
var app = express();
var debug = require('debug')('my-application');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));

//Form
app.post('/login/register/submit', function(req, res) {
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
             console.log(token);
         var smtpTransport = nodemailer.createTransport("SMTP",{
         service: "Gmail",
        auth: {
            user: "duedatesstaff@gmail.com",
            pass: "lasa2k16"
        }
        });
        var url  = "http://duedates.ehsandev.com/token?";
        console.log(token);
        url = url + token;
        console.log(url);
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

app.post('/login/submit', function(req, res) {
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

app.use('/', routes);
app.use('/login', login);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
if (typeof process.env.OPENSHIFT_NODEJS_PORT != "undefined"){
    console.log("Detected Openshift!");
    var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var server = app.listen(port,ip);
}
else{
   var server = app.listen(port);
}
console.log(server.address());

module.exports = app;
