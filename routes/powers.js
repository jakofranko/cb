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


// POSTS
router.post('/addPower', function(req, res) {
	var power = {
		name: req.body.name,
		duration: req.body.duration,
		range: req.body.range,
		target: req.body.target,
		endurance: (req.body.endurance && req.body.endurance == "true") ? true : false,
		cost: req.body.cost
	};
	console.log(power);

	powers.createPower(power, function(err, success) {
		if(err) throw new Error(err);
		else res.redirect('/powers/add');
	});
});

module.exports = router;