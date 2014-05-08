var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login.html',{ message: req.flash('signinflash') });
});
router.get('/register', function(req, res) {
  res.redirect('login/register');
});
router.get('/profile', function(req, res) {
  console.log(req.user);
  res.render('profile.html',{
			user :  req.user // get the user out of session and pass to template
	});
});
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
module.exports = router;