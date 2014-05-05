var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login.html');
});
router.get('/register', function(req, res) {
  res.redirect('login/register');
});

module.exports = router;
