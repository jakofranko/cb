var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var talents = require('../models/talents');

// Checks to see if the user is admin
router.use(function(req, res, next) {
	if(req.session.role == 'admin') {
		next();
	} else {
		res.redirect('/');
	}
});

// Gets -------------------------------
router.get('/', function(req, res) {
	talents.listTalents(function(err, results) {
		if(err) throw new Error(err);
		else res.render('talentTypes/view', { title: 'Talents', talents: results, session: req.session });
	});
});

router.get('/add', function(req, res) {
	res.render('talentTypes/add', { title: 'New Talent', session: req.session });
});

router.get('/edit/:talentID', function(req, res) {
	talents.getTalent({ _id: req.params.talentID }, function(err, talent) {
		res.render('talentTypes/edit', { title: 'Edit Talent: ' + talent.name, session: req.session, talent: talent });
	});
});

// Gets -------------------------------
router.post('/addTalent', function(req, res) {
	console.log(req.body);
	var bonusToRoll = (req.body.bonusToRoll && req.body.bonusToRoll != "0") ? req.body.bonusToRoll : null;
	var adders;
	if(req.body.adders.length > 1 || (req.body.adders.length > 0 && req.body.adders[0].name !== "" && req.body.adders[0].cost !== "")) {
		adders = req.body.adders;
	} else {
		adders = null;
	}

	talents.createTalent(req.body.name, req.body.cost, bonusToRoll, adders, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/talents');
	});
});

router.post('/updateTalent', function(req, res) {
	var bonusToRoll = (req.body.bonusToRoll && req.body.bonusToRoll != "0") ? req.body.bonusToRoll : null;
	var adders;
	if(req.body.adders && (req.body.adders.length > 1 || (req.body.adders.length > 0 && req.body.adders[0].name !== "" && req.body.adders[0].cost !== ""))) {
		adders = req.body.adders;
	} else {
		adders = null;
	}

	var update = { 
		name: req.body.name, 
		cost: Number(req.body.cost), 
		bonusToRoll: bonusToRoll, 
		adders: adders 
	};

	talents.updateTalent(req.body.talentID, update, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/talents');
	});
});

router.post('/deleteTalent', function(req, res) {
	talents.deleteTalent(req.body.talentID, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/talents');
	});
});

module.exports = router;