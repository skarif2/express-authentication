var mongoose = require('mongoose');

var Book = mongoose.model('Book', {
	title: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	genre: { type: String },
	pages: { type: String },
	publisher: { type: String },
	image_url: { type: String, required: true },
	buy_url: { type: String, required: true },
	likes: { type: String, required: false }
});

module.exports = Book;
