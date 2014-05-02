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
var mysql      = require('mysql');
var connection;
connection = mysql.createConnection({
      host     : 'ehsandev.com',
      user     : 'duedates',
      password : 'lasa2k16',
      database : 'duedates',
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
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));


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
