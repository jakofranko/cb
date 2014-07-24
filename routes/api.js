var express = require('express');
var router = express.Router();
var users = require('../models/users');

// API
// ------------------------------------

router.get('/users', function(req, res) {
	users.listUsers(function(err, users) {
		if(err) throw err;
		res.send(users);
	});
});

router.get('/user/:username', function(req, res) {
	users.findUserByName(req.params.username, function(err, user) {
		if (user)	res.send('1');
    	else					res.send('0');
	});
});

module.exports = router;
