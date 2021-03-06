var express = require('express');
var router = express.Router();
var helpers = require('../middleware/helpers');
var users = require('../models/users');
var characters = require('../models/characters');
var skillTypes = require('../models/skillType');
var martialArts = require('../models/martialArts');
var martialManeuvers = require('../models/martialManeuvers');
var perks = require('../models/perks');
var talents = require('../models/talents');

// CHARACTERS
// ------------------------------------

// Gets -------------------------------
// Characteristics
router.get('/characteristics/edit/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else res.render('characteristics/edit', { title: character.alias + ' Characteristics', character: character, username: req.session.username });
	});
});

router.get('/characteristics/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else res.render('characteristics/view', { title: character.alias + ' Characteristics', character: character, username: req.session.username });
	});
});

// Martial Arts
router.get('/martialArts/add/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		martialManeuvers.listMartialManeuvers(function(err, mm) {
			res.render('martialArts/add', { character: character, mm: mm, username: req.session.username });
		});
	});
});

router.get('/martialArts/edit/:maID', helpers.canEdit, function(req, res) {
	martialArts.getMartialArt(req.params.maID, function(err, ma) {
		if(ma) {
			characters.findCharacterById(ma.characterID, function(err, character) {
				martialManeuvers.listMartialManeuvers(function(err, mms) {
					res.render('martialArts/edit', { character: character, ma: ma, mms: mms, username: req.session.username });	
				});
			});
		}
	});
});

router.get('/martialArts/deleteMartialArt/:charID,:maID', helpers.canEdit, function(req, res) {
	martialArts.removeMartialArt(req.params.maID, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/characters/skills/' + req.params.charID);
	});
});

router.get('/martialArts/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		martialArts.listMartialArts(character._id, function(err, ma) {
			res.render('martialArts/list', { character: character, martialArts: ma });
		});
	});
});

// Perks
router.get('/perks/add/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else {
			perks.listPerks(function(err, perks) {
				res.render('perks/add', { title: 'Perks', character: character, perks: perks, username: req.session.username });
			});
		}
	});
});

router.get('/perks/edit/:characterID,:perkID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else {
			characters.findPerk(req.params.characterID, req.params.perkID, function(err, perk) {
				if(err) throw new Error(err);
				else {
					perks.getPerk({name: perk.type}, function(err, perkType) {
						if(err) throw new Error(err);
						else {
							res.render('perks/edit', { title: 'Perks', character: character, perk: perk, perkType: perkType, username: req.session.username });
						}
					});
				}
			});
		}
	});
});

router.get('/perks/delete/:characterID,:perkID', helpers.canEdit, function(req, res) {
	characters.removePerk(req.params.characterID, req.params.perkID, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/characters/perks/' + req.params.characterID);
	});
});

router.get('/perks/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else res.render('perks/view', { title: 'Perks', character: character, username: req.session.username });
	});
});

// Talents
router.get('/talents/add/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else {
			talents.listTalents(function(errTwo, talents) {
				if(errTwo) callback(errTwo);
				else res.render('talents/add', { title: 'Add Talents', character: character, talents: talents, username: req.session.username });
			});
		}
	});
});

router.get('/talents/edit/:characterID,:talentID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else {
			var talent = character.Talents.id(req.params.talentID);
			res.render('talents/edit', { title: 'Edit Talent', character: character, talent: talent, username: req.session.username });
		}
	});
});

router.get('/talents/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else res.render('talents/view', { title: 'Talents', character: character, username: req.session.username });
	});
});

// Skills
router.get('/skills/add/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		var skilltypes;
		skillTypes.listSkillTypes(function(err, results) {
			skilltypes = results;
			res.render('skills/add', { title: 'Add skills for ' + character.alias, character: character, username: req.session.username, skilltypes: skilltypes });
		});
	});	
});

router.get('/skills/edit/:characterID,:skillID', helpers.canEdit, function(req, res) {
	var character;
	characters.findCharacterById(req.params.characterID, function(err, character) {
		character = character;
		characters.findSkill(req.params.characterID, req.params.skillID, function(err, skill) {
			res.render('skills/edit', { title: 'Editing ' + skill.skillType.name, character: character, username: req.session.username, skill: skill });
		});
	});
});

router.get('/skills/deleteSkill/:charID,:skillID', helpers.canEdit, function(req, res) {
	characters.removeSkill(req.params.charID, req.params.skillID, function(err, character, numAffected) {
		if(err) throw new Error(err);
		else res.redirect('/characters/skills/' + character._id)
	});
});

router.get('/skills/skillEnhancers/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(err) throw new Error(err);
		else res.render('skills/skillEnhancers', {character: character});
	});
});

router.get('/skills/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		martialArts.listMartialArts(req.params.characterID, function(err, ma) {
			res.render('skills/view', { title: character.alias + ' skills', character: character, ma: ma, username: req.session.username });	
		});
	});
});

// Characters
router.get('/add', function(req, res) {
	res.render('characters/add', { title: 'New Character', username: req.session.username });
});

// TODO: Need to add authentication, so that only users that own the character can edit or remove those characters
router.get('/edit/:characterID', helpers.canEdit, function(req, res) {
	characters.findCharacterById(req.params.characterID, function(err, character) {
		if(character != null)
			res.render('characters/edit', { title: 'Edit ' + character.alias, character: character, baseCharicteristic: 10 });
		else 
			res.redirect('/');
	});
});

router.get('/remove/:characterID', helpers.canEdit, function(req, res) {
	characters.removeCharacter({ _id: req.params.characterID }, function(err, character) {
		res.redirect('/dashboard/' + req.session.username);
	});
});

router.get('/:characterID', function(req, res) {
	martialArts.listMartialArts(req.params.characterID, function(err, martialArts) {
		if(err) throw new Error(err);
		else {
			characters.findCharacterById(req.params.characterID, function(err, character) {
				res.render('characters/view', { title: character.alias, character: character, ma: martialArts, username: req.session.username });
			});
		}
	});
});


// Posts ------------------------------
// Character
router.post('/addCharacter', function(req, res) {
	userID = (req.session._id) ? req.session._id : null;
	
	// TODO: Right now, base 10 characteristic is hardcoded in. This should become changable by the GM at some point
	characters.createCharacter(req.body.name, req.body.alias, req.body.description, req.body.basePool, userID, 10, function(err, results) { 
		if(err) throw new Error(err);
		else if(results == "" || results == null) {
			console.error('Character was not created');
		} else {
			res.redirect('/characters/characteristics/edit/' + results._id);
		}
	});
});

router.post('/updateCharacter', helpers.canEdit, function(req, res) {
	characters.updateCharacter({_id: req.body._id },
	{ 
		alias: req.body.alias,
		name: req.body.name,
		description: req.body.description,
		basePool: req.body.basePool,
	}, false, function(err, result) {
		res.redirect('/characters/' + req.body._id);
	});
});

// Skills
router.post('/addSkill', helpers.canEdit, function(req, res) {
	var skill = req.body.skill,
		categories = req.body.categories || [],
		subcategories = req.body.subcategories || [],
		characteristicBased = req.body.characteristicBased,
		roll = req.body.roll,
		skillOptions = req.body.skillOptions || [],
		cost = req.body.cost;

	characters.addSkill(req.body.characterID, req.body.skill, req.body.categories, req.body.subcategories, req.body.characteristicBased, req.body.familiarity, Number(req.body.roll), req.body.skillOptions, req.body.cost, function(err, result) {
		if(err) throw new Error(err);
		else res.send(result);
	});
});

router.post('/updateSkill', helpers.canEdit, function(req, res) {
	var skillID 			= req.body.skillID,
		categories 			= (req.body.categories) ? req.body.categories : null,
		subcategories 		= (req.body.subcategories) ? req.body.subcategories : null,
		familiarity 		= req.body.familiarity,
		characteristicBased = req.body.characteristicBased,
		roll 				= Number(req.body.roll);
		skillOptions 		= (req.body.skillOptions) ? req.body.skillOptions : null,
		cost 				= req.body.cost;

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

router.post('/updateSkillEnhancers', helpers.canEdit, function(req, res) {
	var skillEnhancers = [];
	for(var se in req.body)
		if(se != "characterID" && se != "skillEnhancerCost") skillEnhancers.push(se);
	characters.updateCharacter({_id: req.body.characterID}, {skillEnhancers: skillEnhancers}, req.body.skillEnhancerCost, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/characters/skills/' + req.body.characterID);
	});
});

// Characteristics
router.post('/updateCharacteristics', helpers.canEdit, function(req, res) {
	// All of the mods need to have the base subtracted from them in order to get the actual difference. Otherwise, these stats will inflate every time they're updated.
	characters.updateCharacter({_id: req.body.characterID },
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
		PreAtt: Number(req.body.PreAtt)
	}, req.body.spent, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/characters/' + req.body.characterID);
	});
});

// Martial Arts
router.post('/addMartialArt', helpers.canEdit, function(req, res) {
	// Fetch maneuvers, store them in array for manipulation
	var maneuvers = req.body.mm;
	for(var key in maneuvers) {
		// Anonymous function solves scope issue
		(function(key) {
			martialManeuvers.getMartialManeuver({ _id: maneuvers[key].type}, function(err, result) {
				if(err) throw new Error(err);
				else {
					// Set the type equal to the standard martial maneuver object
					maneuvers[key].type = result;

					// If the user did not name the maneuver, use default name
					if(maneuvers[key].name == '') {
						maneuvers[key].name = result.name;
					}

					// Once all the maneuvers have been looped through, create the custom martial art
					if((Number(key) + 1) == maneuvers.length) {
						martialArts.createMartialArt(req.body.maName, req.body.characterID, maneuvers, req.body.maDCs, req.body.weaponElement, function(err, result) {
							if(err) throw new Error(err);
							else {
								res.redirect('/characters/skills/' + req.body.characterID);
							}
						});
					}
				}
			});
		})(key);
	}
});

router.post('/updateMartialArt', helpers.canEdit, function(req, res) {
	var maneuvers = req.body.mm;
	for(var key in maneuvers) {
		// Anonymous function solves scope issue
		(function(key) {
			martialManeuvers.getMartialManeuver({ _id: maneuvers[key].type}, function(err, result) {
				if(err) throw new Error(err);
				else {
					// Set the type equal to the standard martial maneuver object
					maneuvers[key].type = result;

					// If the user did not name the maneuver, use default name
					if(maneuvers[key].name == '') {
						maneuvers[key].name = result.name;
					}

					// Once all the maneuvers have been looped through, create the custom martial art
					if((Number(key) + 1) == maneuvers.length) {
						martialArts.updateMartialArt({ _id: req.body.maID }, { name: req.body.maName, maneuvers: maneuvers, additionalDCs: req.body.maDCs, weaponElement: req.body.weaponElement }, function(err, result) {
							if(err) throw new Error(err);
							else {
								res.redirect('/characters/skills/' + req.body.characterID);
							}
						});
					}
				}
			});
		})(key);
	}
});

// Perks
router.post('/addPerk', helpers.canEdit, function(req, res) {
	var perk = {
		name: req.body['perk-name'],
		type: req.body['perk-type'],
		cost: Number(req.body['perk-cost']),
		perkOptions: req.body.perkOptions
	};
	characters.addPerk(req.body.characterID, perk, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/characters/perks/' + req.body.characterID);
	})
});

router.post('/updatePerk', helpers.canEdit, function(req, res) {
	var perk = {
		name: req.body['perk-name'],
		type: req.body['perk-type'],
		cost: Number(req.body['perk-cost']),
		perkOptions: req.body.perkOptions
	};
	characters.updatePerk(req.body.characterID, req.body.perkID, perk, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/characters/perks/' + req.body.characterID);
	})
});

// Talents
router.post('/addTalent', helpers.canEdit, function(req, res) {
	talents.getTalent({_id: req.body.talentID}, function(err, talent) {
		if(err) throw new Error(err);
		else var talentType = talent;

		var talent = {
			name: (req.body.name != '') ? req.body.name : null,
			type: talentType,
			cost: req.body.cost,
			bonusToRoll: (req.body.bonusToRoll != '') ? req.body.bonusToRoll : null,
			adders: req.body.adders
		};
		characters.addTalent(req.body.characterID, talent, function(err, newTalent) {
			if(err) callback(err);
			else res.redirect('/characters/talents/' + req.body.characterID);
		});
	});
});

router.post('/updateTalent', helpers.canEdit, function(req, res) {
	var updatedTalent = {
		name: (req.body.name != '') ? req.body.name : null,
		cost: Number(req.body.cost),
		bonusToRoll: (req.body.bonusToRoll != '') ? Number(req.body.bonusToRoll) : null,
		adders: req.body.adders
	};
	characters.updateTalent(req.body.characterID, req.body.talentID, updatedTalent, function(err, _) {
		if(err) throw new Error(err);
		else res.redirect('/characters/talents/' + req.body.characterID);
	});
});

router.post('/deleteTalent', helpers.canEdit, function(req, res) {
	console.log(req.body);
	characters.removeTalent(req.body.characterID, req.body.talentID, function(err, _) {
		if(err) throw new Error(err);
		else res.redirect('/characters/talents/' + req.body.characterID);
	});
});

module.exports = router;