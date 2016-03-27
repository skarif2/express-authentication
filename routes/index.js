var express = require('express');
var router = express.Router();

// Models
var Book = require('../models/book.model.js');


// local Routes for '/'
router.get('/', function(req, res, next) {
  Book.find({}, function(err, books){
		if(err){
      res.render('404');
    } else{
      if(books){
        res.render('index', { title: 'Latest Books', books: books });
      } else {
        res.render('index', { title: 'Latest Books' });
      }
    }
	});
});
router.get('/books/:_id', function(req, res, next){
  var _id = req.params._id;
  Book.findById({ _id: _id } , function(err, book){
		if(err){
      res.render('404');
    } else{
      if(book){
        res.render('bookdetails', { title: 'Book Details', book: book });
      } else {
        res.render('404');
      }
    }
	});
});
router.get('/likes/:_id', function(req, res, next){
  var _id = req.params._id;
  Book.findById({ _id: _id } , function(err, book){
		if(err){
      res.redirect('/');
    } else{
      if(book){
        book.likes = (parseInt(book.likes) + 1).toString();
        Book.update({_id: book._id}, book, { }, function(err, book){
          console.log(book);
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    }
	});
})

module.exports = router;
