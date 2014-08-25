var express = require('express');
var router = express.Router();
var users = require('../models/users');

// USERS
// ------------------------------------
router.post('/signup', function(req, res) {
    users.createUser(req.body.username, req.body.password, function(err, user) {
        if(err) throw new Error(err);
        req.session._id = user._id;
		res.redirect('/dashboard/' + req.body.username);
    });
});

router.post('/login', function(req, res) {
	users.authenticate({ username: req.body.username }, req.body.password, function(err, authenticated) {
		if(authenticated) {
			req.session._id = authenticated._id;
			req.session.username = authenticated.username;
			req.session.role = authenticated.role;
			res.redirect('/dashboard/' + req.body.username);	
		} 
		else res.render('index', {messages: ['Wrong username or password']});
	});
});

module.exports = router;