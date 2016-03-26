var mongoose = require('mongoose');

var Admin = mongoose.model('Admin', {
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true }
});

module.exports = Admin;
