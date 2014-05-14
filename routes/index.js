var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection;
connection = mysql.createConnection({
      host     : 'ehsandev.com',
      user     : 'duedates',
      password : 'lasa2k16',
      database : 'duedates',
});
/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.render('login.html',{ message: req.flash('signinflash'), welcome: req.user.realname , isauthed: true});
  }
  else {
    res.render('login.html',{ message: req.flash('signinflash'), welcome: "Please Sign in above", isauthed: false});
  }
});
router.get('/token', function(req, res) {
  var id = req.query.id;
  var connect = connection.query('SELECT * FROM users WHERE emailtoken = \'' + id + '\'', function(err,rows,fields){
      console.log(connect.sql);
      if (rows && rows[0]) {
        var query = connection.query('UPDATE users SET verified=1 WHERE username=\'' + rows[0].username + '\'');
      }
   });
  res.redirect('/');
});
router.get('/register', function(req, res) {
  res.redirect('login/register');
});
router.get('/settings', function(req, res) {
  res.render('settings.html', {
			isauthed: req.isAuthenticated() 
		});
});
router.get('/profile', isLoggedIn, function(req, res) {
  console.log(req.user);
  res.render('profile.html',{
			user :  req.user, // get the user out of session and pass to template
			isauthed: req.isAuthenticated() 
	});
});
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = router;
