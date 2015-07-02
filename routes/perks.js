var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var perks = require('../models/perks');

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
	perks.listPerks(function(err, results) {
		if(err) throw new Error(err);
		else res.render('perks/view', { title: 'Perks', perks: results, session: req.session });
	});
});

router.get('/add', function(req, res) {
	res.render('perks/add', { title: 'New Perk', session: req.session });
});

// Gets -------------------------------
router.post('/addPerk', function(req, res) {
	perks.createPerk(req.body.name, { minCost: Number(req.body.minCost), maxCost: Number(req.body.maxCost) }, function(err, result) {
		console.log(err, result);
		if(err) throw new Error(err);
		else res.redirect('/perks');
	});
});

module.exports = router;