var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

// Models
var Admin = require('../models/admin.model.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if( req.session_state && req.session_state.admin ){
    Admin.findOne({ email: req.session_state.admin.email }, function(err, admin){
      if(!admin){
        req.session_state.reset();
        res.redirect('/dashboard/login');
      } else {
        res.locals.admin = admin;
        res.render('dashboard', { title: 'Dashboard' });
      }
    });
  } else {
    res.redirect('/dashboard/login');
  }
});

router.get('/login', function(req, res, next){
	res.render('adminlogin', { title: 'Admin Login', error:'' });
});
router.post('/login', function(req, res, next){
  console.log(req.body.email);
  Admin.findOne( { email: req.body.email }, function(err, admin){
    if(err){
      res.render('adminlogin', { title: 'Admin Login', error: 'Incorrect email / password.' });
    } else {
      if(bcrypt.compareSync(req.body.password, admin.password)){
        req.session_state.admin = admin; 
        res.redirect('/dashboard');
      } else {
        res.render('adminlogin', { title: 'Admin Login', error: 'Incorrect email / password.' });
      }
    }
  });
});

router.get('/register', function(req, res, next){
	res.render('adminregister', { title: 'Admin Register', error:'' });
});
router.post('/register', function(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var passHash = bcrypt.hashSync(req.body.password, salt);

  var admin = new Admin({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: passHash,
  });

  admin.save(function(err){
    if(err){
      if(err.code === 11000){
        res.render('adminregister', { title: 'Admin Register', error: 'The email is already taken.' });
      } else {
        res.render('adminregister', { title: 'Admin Register', error: 'Something went wrong. Please try again.' });
      }
    } else{
      req.session_state.admin = admin;
      res.redirect('/dashboard');
    }
  });
});

router.get('/logout', function(req, res, next){
  req.session_state.reset();
  res.redirect('/dashboard/login');
})
module.exports = router;
