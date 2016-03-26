var express = require('express');
var router = express.Router();

// Models
var Admin = require('../models/admin.model.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});

router.get('/login', function(req, res, next){
	res.render('adminlogin', { title: 'Admin Login' });
});
router.post('/login', function(req, res, next){
  console.log(req.body.email);
  Admin.findOne( { email: req.body.email }, function(err, admin){
    if(err) throw err;
    else{
      if(admin.password === req.body.password){
        res.redirect('/dashboard');
      } else {
        res.redirect('/dashboard/login')
      }
    }
  });
});

router.get('/register', function(req, res, next){
	res.render('adminregister', { title: 'Admin Register' });
});
router.post('/register', function(req, res, next){
	res.redirect('/');
});

module.exports = router;
