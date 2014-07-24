var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');

// CHARACTERS
// ------------------------------------

router.get('/add', function(req, res) {
	res.render('charactersAdd', { title: 'New Character', username: req.session.username });
});

// Need to add authentication, so that only users that own the character can edit or remove those characters
router.get('/edit/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		res.render('charactersEdit', { title: 'Edit ' + character.alias, character: character, baseCharicteristic: 10 });
	});
});

router.get('/remove/:characterID', function(req, res) {
	characters.removeCharacter({ _id: req.params.characterID }, function(err, character) {
		console.log(err, character);
		res.redirect('/dashboard/' + req.session.username);
	});
});

router.get('/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		res.render('charactersShow', { title: character.alias, character: character, username: req.session.username });
	});
});

router.post('/submitCharacter', function(req, res) {
	userID = (req.session._id) ? req.session._id : null;
	
	// Right now, base 10 characteristic is hardcoded in. This should become changable by the GM at some point
	characters.createCharacter(req.body.name, req.body.alias, req.body.description, userID, 10, function(err, results) { 
		if(err) throw new Error(err);
		else if(results == "" || results == null) {
			console.error('Character was not created');
		} else {
			console.log(userID, results);		
			res.redirect('/characters/edit/' + results._id);
		}
	});
});

// router.get('/:username', function(req, res) {
// 	// Will find the user whose name matches /dashboard/:username
// 	users.findUserByName(req.params.username, function(err, user) {

// 		// If a user is found, it passes that user to the dashboard view, where all their info can be displayed
// 		if(user._id == req.session._id) res.render('dashboard', { title: 'Dashboard', user: user });
// 		else {
// 			var err = new Error('Not Authorized');
//     		err.status = 401;
// 			res.status(err.status)
//     		res.render('error', { message: err.message, error: err });
// 		}
// 	});
// });

// router.post('/authenticate', function(req, res) {
// 	users.authenticate({ _id: req.session._id }, req.body.password, function(err, authenticated) {
// 		if(err) throw new Error(err);
// 		else res.send(authenticated);
// 	})
// });

// router.post('/updateEmail', function(req, res) {
// 	users.updateUser({ _id: req.session._id }, { email: req.body.email }, function(err, results) {
// 		if(err) throw new Error(err);
// 		else res.send(results);
// 	});
// });

// router.post('/updatePassword', function(req, res) {
// 	users.updateUser({ _id: req.session._id }, { password: req.body.password }, function(err, results) {
// 		if(err) throw new Error(err);
// 		else res.send(results);
// 	});
// });

module.exports = router;