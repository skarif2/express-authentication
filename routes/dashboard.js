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

// local routes for '/dashboard'
router.get('/', CheckSession, LoginRequired, function(req, res, next) {
  Book.find({}, function(err, books){
		if(err){
      res.render('dashboard', { title: 'Dashboard' });
    } else{
      if(books){
        res.render('dashboard', { title: 'Dashboard', books: books });
      } else {
        res.render('dashboard', { title: 'Dashboard' });
      }
    }
	});
});
router.get('/login', function(req, res, next){
	res.render('adminlogin', { title: 'Admin Login'});
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

router.get('/books/:_id', CheckSession, LoginRequired, function(req, res, next){
  var _id = req.params._id;
  Book.findById({ _id: _id } , function(err, book){
		if(err){
      res.render('404');
    } else{
      if(book){
        res.render('adminbookdetails', { title: 'Book Details', book: book });
      } else {
        res.render('404');
      }
    }
	});
});
router.get('/editbook/:_id', CheckSession, LoginRequired, function(req, res, next){
  var _id = req.params._id;
  Book.findById({ _id: _id } , function(err, book){
		if(err){
      res.render('404');
    } else{
      if(book){
        res.render('editbook', { title: 'Edit Book', book: book });
      } else {
        res.render('404');
      }
    }
	});
});
router.post('/editbook/:_id', CheckSession, LoginRequired, function(req, res, next){
  var _id = req.params._id ;
  var book = new Book({
    _id: req.body._id,
    likes: req.body.likes,
    buy_url: req.body.buy_url,
    image_url: req.body.image_url,
    publisher: req.body.publisher,
    pages: req.body.pages,
    genre: req.body.genre,
    description: req.body.description,
    author: req.body.author,
    title: req.body.title,
  });
  Book.findOneAndUpdate({ _id: _id}, book, {new: true}, function(err, book){
    if(err){
      console.log(err);
    }
    if(!book){
      res.redirect('/dashboard/editbook/' + req.params._id);
    } else {
      res.redirect('/dashboard');
    }
  });
});
router.get('/deletebook/:_id', CheckSession, LoginRequired, function(req, res, next){
  var id = req.params._id ;
  var query = { _id: id};
	Book.remove(query, function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/dashboard');
    }
  });
});

module.exports = router;
