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
				res.render('martialManeuvers/show', { title: 'Martial Maneuvers', mms: mms, session: req.session });
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.get('/add', function(req, res) {
	if(req.session.role == 'admin')	{
		res.render('martialManeuvers/add', { title: 'Add New Martial Maneuver' });
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
				res.render('martialManeuvers/edit', { maneuver: maneuver })
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

router.post('/updateMartialManeuver', function(req, res) {
	if(req.session.role == 'admin')	{
		var mm = req.body;
		var update = new Object();
		for(var key in mm) {
			if(key != '_id') {
				update[key] = mm[key];	
			}
		}
		martialManeuvers.updateMartialManeuver({ _id: mm._id }, update, function(err, result) {
			if(err) throw new Error(err);
			else {
				res.redirect("/martialManeuvers/");
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.post('/deleteMartialManeuver', function(req, res) {
	if(req.session.role == 'admin')	{
		var mm = req.body;
		martialManeuvers.removeMartialManeuver(mm._id, function(err, result) {
			if(err) throw new Error(err);
			else {
				res.redirect("/martialManeuvers/");
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.post('/newArt', function(req, res) {
	var mms = [];
	var count = req.body.mms.length;
	for(i = 0; i < count; i++) {
		var _id = req.body.mms[i];

		// WEIRD feature of javascript...read here for why I have to use an anonymous function and pass in i:
		// http://blog.mixu.net/2011/02/03/javascript-node-js-and-for-loops/
		(function(i) {
			martialManeuvers.getMartialManeuver({_id: _id}, function(err, result) {
				mms.push(result);
				if(i + 1 == count) {
					return res.render('martialManeuvers/newArt', { selectedManeuvers: mms });
				}
			});
		})(i);	
	}
});

module.exports = router;