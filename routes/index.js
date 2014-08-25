var express = require('express');
var router = express.Router();
var users = require('../models/users')

/* GET home page. */
router.get('/', function(req, res) {
	if(req.session._id){
		res.redirect('/dashboard/' + req.session.username);
	}
	res.render('index', { title: 'Welcome!' });
});


module.exports = router;
