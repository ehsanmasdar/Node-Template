var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var flash = require('connect-flash');
var connection;
var session = require('express-session');
connection = mysql.createConnection({
      host     : 'ehsandev.com',
      user     : 'duedates',
      password : 'lasa2k16',
      database : 'duedates',
    });

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

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

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

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;
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
