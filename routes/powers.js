var express = require('express');
var router = express.Router();
var helpers = require('../middleware/helpers');
var users = require('../models/users');
var characters = require('../models/characters');
var powers = require('../models/powers');

router.get('/', helpers.isAdmin, function(req, res) {
	powers.listPowers(function(err, powers) {
		res.render('powerTypes/view', {title: 'Powers', powers: powers, username: req.session.username});
	});
});

module.exports = router;