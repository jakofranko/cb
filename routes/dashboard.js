var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');

// DASHBOARD
// ------------------------------------
router.get('/logout', function(req, res) {
	res.redirect('/');
	req.session.destroy(function(err) {
		if(err) throw new Error(err);		
	});
});

router.get('/:username', function(req, res) {
	// Will find the user whose name matches /dashboard/:username
	users.findUserByName(req.params.username, function(err, user) {

		if(req.params.username == 'undefined') {
			res.redirect('/');
		}
		// If a user is found, it passes that user to the dashboard view, where all their info can be displayed
		else if(user._id == req.session._id) {
			var userChars = [];
			characters.findCharacterByUserId(req.session._id, function(err, results) {
				if(!err) {
					userChars = results;
					res.render('dashboard', { title: 'Dashboard', user: user, characters: userChars });
				} else {
					throw new Error(err);
				}
			});
		} else {
			var err = new Error('Not Authorized');
    		err.status = 401;
			res.status(err.status)
    		res.render('error', { message: err.message, error: err });
		}
	});
});

router.post('/authenticate', function(req, res) {
	users.authenticate({ _id: req.session._id }, req.body.password, function(err, authenticated) {
		if(err) throw new Error(err);
		else res.send(authenticated);
	})
});

router.post('/updateEmail', function(req, res) {
	users.updateUser({ _id: req.session._id }, { email: req.body.email }, function(err, results) {
		if(err) throw new Error(err);
		else res.send(results);
	});
});

router.post('/updatePassword', function(req, res) {
	users.updateUser({ _id: req.session._id }, { password: req.body.password }, function(err, results) {
		if(err) throw new Error(err);
		else res.send(results);
	});
});

module.exports = router;