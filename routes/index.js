var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
  	  	res.render('login.html',{ message: req.flash('signinflash')}, {welcome : "Welcome back, " + req.user.username });
  }
  else {
  		res.render('login.html',{ message: req.flash('signinflash')}, {welcome : "Please Sign in above"});
  }
});
router.get('/register', function(req, res) {
  res.redirect('login/register');
});
router.get('/profile', isLoggedIn, function(req, res) {
  console.log(req.user);
  res.render('profile.html',{
			user :  req.user // get the user out of session and pass to template
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