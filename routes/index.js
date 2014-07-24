var express = require('express');
var router = express.Router();
var users = require('../models/users')

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Welcome!' });
});


module.exports = router;
