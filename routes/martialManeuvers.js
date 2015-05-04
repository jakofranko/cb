var express = require('express');
var router = express.Router();
var martialManeuvers = require('../models/martialManeuvers')

// GET
// --------------------------------------------------------------
router.get('/', function(req, res) {
	if(req.session.role == 'admin')	{
		martialManeuvers.listMartialManeuvers(function(err, mms) {
			if(err) throw new Error(err);
			else {
				res.render('martialManeuversShow', { title: 'Martial Maneuvers', mms: mms, session: req.session });
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.get('/add', function(req, res) {
	if(req.session.role == 'admin')	{
		res.render('martialManeuversAdd', { title: 'Add New Martial Maneuver' });
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.get('/edit/:mmId', function(req, res) {
	if(req.session.role == 'admin')	{
		martialManeuvers.getMartialManeuver({ _id: req.params.mmId }, function(err, maneuver) {
			if(err) throw new Error(err);
			else {
				console.log(maneuver);
				res.render('martialManeuversEdit', { maneuver: maneuver })
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

// POST
// --------------------------------------------------------------
router.post('/addMartialManeuver', function(req, res) {
	if(req.session.role == 'admin')	{
		console.log(req.body);
		var mm = req.body;
		martialManeuvers.createMartialManeuver(mm.name, mm.phase, mm.ocv, mm.dcv, mm.cost, mm.effects, function(err, result) {
			if(err) throw new Error(err);
			else {
				res.redirect("/martialManeuvers/");
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

module.exports = router;