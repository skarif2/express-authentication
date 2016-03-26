var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Admin Panel' });
});

router.get('/login', function(req, res, next){
	res.render('adminlogin', { title: 'Admin Login' });
});

router.get('/register', function(req, res, next){
	res.render('adminregister', { title: 'Admin Register' });
});

module.exports = router;
