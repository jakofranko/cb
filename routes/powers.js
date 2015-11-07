var express = require('express');
var router = express.Router();
var helpers = require('../middleware/helpers');
var users = require('../models/users');
var characters = require('../models/characters');
var powers = require('../models/powers');

// Only Admins allowed
router.use(helpers.isAdmin);

// GETS
router.get('/', function(req, res) {
	powers.listPowers(function(err, powers) {
		if(err) throw new Error(err);
		else res.render('powerTypes/view', {title: 'Powers', powers: powers, username: req.session.username});
	});
});

router.get('/add', function(req, res) {
	res.render('powerTypes/add', {title: 'New Power'});
});

router.get('/edit/:powerID', function(req, res) {
	powers.getPower({_id: req.params.powerID}, function(err, power) {
		if(err) throw new Error(err);
		else res.render('powerTypes/edit', {title: 'New Power', power: power});
	});
});

// POSTS
router.post('/addPower', function(req, res) {
	var power = {
		name: req.body.name,
		duration: req.body.duration,
		range: req.body.range,
		target: req.body.target,
		endurance: (req.body.endurance && req.body.endurance == "true") ? true : false,
		cost: req.body.cost,
		category: req.body.category,
		exclusiveVariants: (req.body.exclusiveVariants && req.body.exclusiveVariants == "true") ? true : false,
		variants: req.body.variant
	};

	powers.createPower(power, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/powers/add');
	});
});

router.post('/updatePower', function(req, res) {
	console.log(req.body);
	var updates = {
		name: req.body.name || null,
		duration: req.body.duration || null,
		range: req.body.range || null,
		target: req.body.target || null,
		endurance: (req.body.endurance && req.body.endurance == "true") ? true : false,
		cost: (req.body.cost.points != null) ? req.body.cost : null,
		category: req.body.category || null,
		exclusiveVariants: (req.body.exclusiveVariants && req.body.exclusiveVariants == "true") ? true : false,
		variants: req.body.variant || null
	};

	powers.updatePower(req.body.powerID, updates, function(err, success) {
		if(err) throw new Error(err);
		else console.log(success); res.redirect('/powers');
	});
});

router.post('/deletePower', function(req, res) {
	powers.removePower(req.body.powerID, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/powers');
	});
});

module.exports = router;