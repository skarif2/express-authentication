var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

// Models
var Admin = require('../models/admin.model.js');
var Book = require('../models/book.model.js');

// Middleware - call if needed.
function CheckSession(req, res, next){
  if( req.session_state && req.session_state.admin ){
    Admin.findOne({ email: req.session_state.admin.email }, function(err, admin){
      if(admin){
        req.admin = admin;
        delete req.admin.password;
        req.session_state.admin = req.admin;
        res.locals.admin = req.admin;
      }
      next();
    });
  } else {
    next();
  }
};
function LoginRequired(req, res, next){
  if(!req.admin){
    res.redirect('/dashboard/login');
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', CheckSession, LoginRequired, function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});
router.get('/login', function(req, res, next){
	res.render('adminlogin', { title: 'Admin Login', error:'' });
});
router.post('/login', function(req, res, next){
  console.log(req.body.email);
  Admin.findOne( { email: req.body.email }, function(err, admin){
    if(!admin){
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
});

router.get('/addbook', CheckSession, LoginRequired, function(req, res, next){
  res.render('addbook', {title: 'Add Book'});
});
router.post('/addbook', CheckSession, LoginRequired, function(req, res, next){
  var book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    genre: req.body.genre,
    pages: req.body.pages,
    publisher: req.body.publisher,
    image_url: req.body.image_url,
    buy_url: req.body.buy_url,
    likes: '0'
  });
  book.save(function(err){
    if(err){
      res.render('addbook', { title: 'Add Book', error: 'Something went wrong. Please try again.' });
    } else{
      res.redirect('/dashboard');
    }
  });
});

module.exports = router;
