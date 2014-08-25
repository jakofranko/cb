var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var skillTypes = require('../models/skillType');

// CHARACTERS
// ------------------------------------


// Gets -------------------------------
router.get('/skills/add/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		console.log(character);
		if(character.userID == req.session._id) {
			var skilltypes;
			skillTypes.listSkillTypes(function(err, results) {
				skilltypes = results;
				res.render('charactersSkillsAdd', { title: 'Add skills for ' + character.alias, character: character, username: req.session.username, skilltypes: skilltypes });
			});
		} else { 
			res.redirect('/');
		}
	});	
});

router.get('/skills/edit/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		res.render('skillsEdit', { title: character.alias + ' edit skills', character: character, username: req.session.username });
	});
});

router.get('/skills/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		res.render('charactersSkills', { title: character.alias + ' skills', character: character, username: req.session.username });
	});
});


router.get('/add', function(req, res) {
	res.render('charactersAdd', { title: 'New Character', username: req.session.username });
});

// Need to add authentication, so that only users that own the character can edit or remove those characters
router.get('/edit/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character != null)
			res.render('charactersEdit', { title: 'Edit ' + character.alias, character: character, baseCharicteristic: 10 });
		else 
			res.redirect('/');
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


// Posts ------------------------------
router.post('/addCharacter', function(req, res) {
	userID = (req.session._id) ? req.session._id : null;
	
	// Right now, base 10 characteristic is hardcoded in. This should become changable by the GM at some point
	characters.createCharacter(req.body.name, req.body.alias, req.body.description, req.body.basePool, userID, 10, function(err, results) { 
		if(err) throw new Error(err);
		else if(results == "" || results == null) {
			console.error('Character was not created');
		} else {
			console.log(userID, results);		
			res.redirect('/characters/edit/' + results._id);
		}
	});
});

router.post('/updateCharacter', function(req, res) {
	// All of the mods need to have the base subtracted from them in order to get the actual difference. Otherwise, these stats will inflate every time they're updated.
	console.log(req.body._id);
	characters.updateCharacter({_id: req.body._id },
	{ 
		alias: req.body.alias,
		name: req.body.name,
		description: req.body.description,
		basePool: req.body.basePool,
		STRmod: (req.body.STRmod - 10),
		DEXmod: (req.body.DEXmod - 10),
		CONmod: (req.body.CONmod - 10),
		BODYmod: (req.body.BODYmod - 10),
		INTmod: (req.body.INTmod - 10),
		EGOmod: (req.body.EGOmod - 10),
		PREmod: (req.body.PREmod - 10),
		COMmod: (req.body.COMmod - 10),
		PDmod: (req.body.PDmod - req.body.PD),
		PD: Number(req.body.PD),
		EDmod: (req.body.EDmod - req.body.ED),
		ED: Number(req.body.ED),
		SPDmod: (req.body.SPDmod - req.body.SPD),
		SPD: Number(req.body.SPD),
		RECmod: (req.body.RECmod - req.body.REC),
		REC: Number(req.body.REC),
		ENDmod: (req.body.ENDmod - req.body.END),
		END: Number(req.body.END),
		STUNmod: (req.body.STUNmod - req.body.STUN),
		STUN: Number(req.body.STUN),
		Leap: Number(req.body.Leap),
		CV: Number(req.body.CV),
		ECV: Number(req.body.ECV),
		Lift: Number(req.body.Lift),
		HTH: Number(req.body.HTH),
		PreAtt: Number(req.body.PreAtt),
		pointsSpent: Number(req.body.pointsSpent)
	}, function(err, result) {
		console.log(err, result);
		res.redirect('/characters/' + req.body._id);
	});
});

module.exports = router;