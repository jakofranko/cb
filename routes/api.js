var express = require('express');
var router = express.Router();
var characters = require('../models/characters');
var users = require('../models/users');
var skillType = require('../models/skillType');

// API
// ------------------------------------

router.get('/users', function(req, res) {
	users.listUsers(function(err, users) {
		if(err) throw new Error(err);
		res.send(users);
	});
});

router.get('/user/:username', function(req, res) {
	users.findUserByName(req.params.username, function(err, user) {
		if(user) res.send('1');
    	else res.send('0');
	});
});

router.get('/skill/:skillID', function(req, res) {
	skillType.findSkillType({ _id: req.params.skillID }, function(err, result) {
		if(err) throw new Error(err);
		else if(result) res.send(result);
	});
});

router.get('/character/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, result) {
		if(err) throw new Error(err);
		else if(result) res.send(result);
	});
});

module.exports = router;
