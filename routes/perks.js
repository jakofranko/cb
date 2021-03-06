var express = require('express');
var helpers = require('../middleware/helpers');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var perks = require('../models/perks');

// Make sure that the user is an Admin
router.use(helpers.isAdmin);

// Gets -------------------------------
router.get('/', function(req, res) {
	perks.listPerks(function(err, results) {
		if(err) throw new Error(err);
		else res.render('perkTypes/view', { title: 'Perks', perks: results, session: req.session });
	});
});

router.get('/add', function(req, res) {
	res.render('perkTypes/add', { title: 'New Perk', session: req.session });
});

router.get('/edit/:perkID', function(req, res) {
	perks.getPerk({ _id: req.params.perkID }, function(err, perk) {
		res.render('perkTypes/edit', { title: 'Edit Perk: ' + perk.name, session: req.session, perk: perk });
	});
});

// Gets -------------------------------
router.post('/addPerk', function(req, res) {
	perks.createPerk(req.body.name, { minCost: Number(req.body.minCost), maxCost: Number(req.body.maxCost) }, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/perks');
	});
});

router.post('/updatePerk', function(req, res) {
	perks.updatePerk({ _id: req.body.perkID }, { name: req.body.name, minCost: Number(req.body.minCost), maxCost: Number(req.body.maxCost) }, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/perks');
	});
});

router.post('/deletePerk', function(req, res) {
	perks.deletePerk(req.body.perkID, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/perks');
	});
});

module.exports = router;