var mysql = require('mysql');
/*--------START CONFIG INFORMATION--------*/

//port of the app
var port = 8081;
//mysql server
var connection = mysql.createConnection({
      host     : 'example.com',
      user     : 'example',
      password : 'example',
      database : 'example',
    });
/*--------END CONFIG INFORMATION--------*/
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
connection.connect(function(err) {
  // connected! (unless `err` is set)
   if(err != null)
      console.log('Error: ' + err);
});
var app = express();
var debug = require('debug')('my-application');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.use(flash());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/static", express.static(__dirname + '/static'));
app.use('/', routes);
app.use('/login', login);
app.use('/register', register);
// Error handling 
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});
var server = app.listen(port);
console.log(server.address());

module.exports = app;