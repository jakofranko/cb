var express = require('express');
var router = express.Router();
var martialManeuvers = require('../models/martialManeuvers')

/* GET home page. */
router.get('/', function(req, res) {
	if(req.session.role == 'admin')	{
		martialManeuvers.listMartialManeuvers(function(err, mms) {
			if(err) throw new Error(err);
			else {
				res.render('martialManeuversShow', { title: 'Martial Maneuvers', mms: mms });
			}
		});
	}
	else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

module.exports = router;