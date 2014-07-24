var crypto = require('crypto'),
	mongoose = require('mongoose'),
	characters = require('./characters');

function encryptPassword(plainText) {
  return crypto.createHash('md5').update(plainText).digest('hex');
}

// Define User Schema
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    characters: Array	// This will be populated with the ID's of associated characters
});

// Create User model from schema
var User = mongoose.model('User', userSchema);

// This is where the create, edit, find and delete methods will go for users.
module.exports = {

	authenticate: function(query, password, callback) {
		var authenticated;
		module.exports.findUser(query, function(err, user) {
			if(err) callback(err);
			else if (user == null) {
				callback('User not found');
			} else {
				if(user.password === encryptPassword(password)) authenticated = user;
				else authenticated = false;
				callback(err, authenticated);
			}
		});
	},
  
	createUser: function(username, password, callback) {
		var user = new User({ username: username, password: encryptPassword(password) });
		user.save(function(err, user) {
			if (err) callback(err);
			else {
				callback(err, user);
				// console.log("User " + user.username + " saved to database!");
			}
		});
	},

	findUser: function(query, callback) {
		User.findOne(query, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	findUserByName: function(username, callback) {
		if(username) {
			User.findOne({ username: username }, function(err, results) {
				if (err) callback(err);
				else {
					callback(err, results);
				}
			});
		} else {
			console.error("Woops, no search query");
			res.redirect('/');
		}
	},

	// findUserAndRemove: function(username, options, callback)

	listUsers: function(callback) {
		User.find(null, function(err, users) {
			if(err) callback(err);
			else callback(err, users);
		});
	},

	updateUser: function(condition, update, options, callback) {
		// If password is being updated, make sure it gets encrypted
		if(update.password != undefined) {
			update.password = encryptPassword(update.password);
		}
		User.findOneAndUpdate(condition, update, options, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	}
}