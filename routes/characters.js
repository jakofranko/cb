var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var skillTypes = require('../models/skillType');
var martialArts = require('../models/martialArts');
var martialManeuvers = require('../models/martialManeuvers');

// CHARACTERS
// ------------------------------------


// Gets -------------------------------
// Characteristics
router.get('/characteristics/edit/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			res.render('characteristicsEdit', { title: character.alias + ' Characteristics', character: character, username: req.session.username });
		} else {
			res.redirect('/');
		}
	});
});

router.get('/characteristics/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			res.render('characteristicsShow', { title: character.alias + ' Characteristics', character: character, username: req.session.username });
		} else {
			res.redirect('/');
		}
	});
});

router.get('/martialArts/add/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			martialManeuvers.listMartialManeuvers(function(err, mm) {
				res.render('martialArts/add', { character: character, mm: mm, username: req.session.username });
			});
		} else {
			res.redirect('/');
		}
	});
});

router.get('/martialArts/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			martialArts.listMartialArts(character._id, function(err, ma) {
				console.log(err, ma);
				res.render('martialArts/list', { character: character, martialArts: ma });
			});
		} else {
			res.redirect('/');
		}
	});
});

// Skills
router.get('/skills/add/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
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

router.get('/skills/edit/:characterID,:skillID', function(req, res) {
	var character;
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			character = character;
			characters.findSkill(req.params.characterID, req.params.skillID, function(err, skill) {
				res.render('charactersSkillsEdit', { title: 'Editing ' + skill.skillType.name, character: character, username: req.session.username, skill: skill });
			});
		} else { 
			res.redirect('/');
		}
	});
});

router.get('/skills/deleteSkill/:charID,:skillID', function(req, res) {
	characters.removeSkill(req.params.charID, req.params.skillID, function(err, character, numAffected) {
		if(err) throw new Error(err);
		else res.redirect('/characters/skills/' + character._id)
	});
});

router.get('/skills/:characterID', function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character.userID == req.session._id) {
			res.render('charactersSkills', { title: character.alias + ' skills', character: character, username: req.session.username });
		} else {
			res.redirect('/');
		}
	});
});

// Characters
router.get('/add', function(req, res) {
	res.render('charactersAdd', { title: 'New Character', username: req.session.username });
});

// TODO: Need to add authentication, so that only users that own the character can edit or remove those characters
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

router.post('/addSkill', function(req, res) {
	var 	skill = req.body.skill,
			categories = req.body.categories || [],
			subcategories = req.body.subcategories || [],
			characteristicBased = req.body.characteristicBased,
			roll = req.body.roll,
			skillOptions = req.body.skillOptions || [],
			cost = req.body.cost;

	characters.addSkill(req.body.characterID, req.body.skill, req.body.categories, req.body.subcategories, req.body.characteristicBased, req.body.familiarity, Number(req.body.roll), req.body.skillOptions, req.body.cost, function(err, result) {
		if(err) {
			throw new Error(err);
		} else {
			characters.updateSpentPoints(req.body.characterID, -cost, function(err, updatedChar) {
				if(err) throw new Error(err);
			});
			res.send(result);	
		}
	});
});

router.post('/updateSkill', function(req, res) {
	var skillID = req.body.skillID,
		categories = (req.body.categories) ? req.body.categories : null,
		subcategories = (req.body.subcategories) ? req.body.subcategories : null,
		familiarity = req.body.familiarity,
		characteristicBased = req.body.characteristicBased,
		roll = Number(req.body.roll);
		skillOptions = (req.body.skillOptions) ? req.body.skillOptions : null,
		cost = req.body.cost;

	var updates = {
		categories: categories,
		subcategories: subcategories,
		familiarity: familiarity,
		characteristicBased: characteristicBased,
		roll: roll,
		skillOptions: skillOptions,
		cost: cost
	};

	characters.updateSkill(req.body.characterID, skillID, updates, function(err, result, numAffected) {
		if(err) {
			throw new Error(err);
		} else {
			characters.updateSpentPoints(req.body.characterID, -cost, function(err, updatedChar) {
				if(err) throw new Error(err);
			});
			res.send(result);	
		}
	});
});

router.post('/updateCharacter', function(req, res) {
	characters.updateCharacter({_id: req.body._id },
	{ 
		alias: req.body.alias,
		name: req.body.name,
		description: req.body.description,
		basePool: req.body.basePool,
	}, function(err, result) {
		res.redirect('/characters/' + req.body._id);
	});
});

router.post('/updateCharacteristics', function(req, res) {
	// All of the mods need to have the base subtracted from them in order to get the actual difference. Otherwise, these stats will inflate every time they're updated.
	characters.updateCharacter({_id: req.body._id },
	{ 
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
		res.redirect('/characters/' + req.body._id);
	});
});

router.post('/addMartialArt', function(req, res) {
	martialArts.createMartialArt(req.body.maName, req.body.characterID, function(err, result) {
		if(result) {
			var regex = /^mm(\d+)\-(\w+)$/;
			for(var val in req.body) {
				var match = val.match(regex);
				console.log(match);
			}
		}
	});	
});

module.exports = router;