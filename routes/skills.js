var express = require('express');
var router = express.Router();
var users = require('../models/users');
var characters = require('../models/characters');
var skillTypes = require('../models/skillType');

// Skills
// ------------------------------------

router.get('/create', function(req, res) {
	if(req.session.role == 'admin')	{
		skillTypes.listSkillTypes(function(err, skilltypes) {
			if(err) throw new Error(err);
			else {
				res.render('skillTypeAdd', { title: 'Create Skill Types', types: skilltypes });
			}
		});
	}
	else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.get('/edit/:skillTypeID', function(req, res) {
	if(req.session.role == 'admin') {
		skillTypes.findSkillType({ _id: req.params.skillTypeID }, function(err, skill) {
			res.render('skillTypeEdit', { title: 'Edit ' + skill.skill, skill: skill })
		});
	} else {
		res.redirect('/');
	}
});

router.get('/manage', function(req, res) {
	if(req.session.role == 'admin') {
		skillTypes.listSkillTypes(function(err, skilltypes) {
			if(err) throw new Error(err);
			else {
				console.log(skilltypes);
				res.render('skillTypeManage', { title: 'Manage Skill Types', types: skilltypes, session: req.session });
			}
		});
	} else {
		res.redirect('/dashboard/' + req.session._id);
	}
});

router.get('/removeSkill/:skillID', function(req, res) {
	if(req.session.role == 'admin') {
		skillTypes.removeSkillType({ _id: req.params.skillID }, function(err, success) {
			if(err) throw new Error(err);
			else if(success === 'success') {
				res.redirect('/skills/manage');
			}
		});
	} else {
		res.redirect('/');
	}
});



// Posts -----------------------
router.post('/addType', function(req, res) {

	var categories = [];
	if(req.body.category1) {
		var categoryList = [];
		var subCategoryList = [];
		var category = /^category\d{1,2}$/;
		var subCategory = /^category\d{1,2}sub\d{1,2}$/;
		for(var key in req.body) {
			if(key.match(category) != null){
				categoryList.push([key, req.body[key]]);
			} else if(key.match(subCategory) != null) {
				subCategoryList.push([key, req.body[key]]);
			}
		}

		var getCategoryNum = /^category(\d{1,2})/;
		categoryList.forEach(function(value, i, list) {

			var catNum = list[i][0].match(getCategoryNum)[1];
			categories[i] = ({ name: list[i][1], subcategories: [] });
			subCategoryList.forEach(function(val, index, subList) {

				var subCatNum = subList[index][0].match(getCategoryNum)[1];
				if(subCatNum == catNum) {
					categories[i].subcategories.push(subList[index][1]);
				}

			});

		});
	}

	skillTypes.createSkillType(req.body.skill, req.body.type, req.body.associatedCharacteristic, req.body.baseCost, req.body.basePlusOne, categories, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/skills/create');
	});
});

router.post('/updateSkillType', function(req, res) {

	var categories = [];
	if(req.body.category1) {
		var categoryList = [];
		var subCategoryList = [];
		var category = /^category\d{1,2}$/;
		var subCategory = /^category\d{1,2}sub\d{1,2}$/;
		for(var key in req.body) {
			if(key.match(category) != null){
				categoryList.push([key, req.body[key]]);
			} else if(key.match(subCategory) != null) {
				subCategoryList.push([key, req.body[key]]);
			}
		}

		var getCategoryNum = /^category(\d{1,2})/;
		categoryList.forEach(function(value, i, list) {

			var catNum = list[i][0].match(getCategoryNum)[1];
			categories[i] = ({ name: list[i][1], subcategories: [] });
			subCategoryList.forEach(function(val, index, subList) {

				var subCatNum = subList[index][0].match(getCategoryNum)[1];
				if(subCatNum == catNum) {
					categories[i].subcategories.push(subList[index][1]);
				}

			});

		});
	}

	skillTypes.updateSkillType({ _id: req.body.skillID }, 
		{ 	
			skill: req.body.skill,
			type: req.body.type,
			associatedCharacteristic: req.body.associatedCharacteristic,
			baseCost: req.body.baseCost,		// This is also the cost for one general category of a skill
			basePlusOne: req.body.basePlusOne,
			categories: categories
		}, function(err, updatedSkill) {
			if(err) throw new Error(err);
			else {
				res.redirect('/skills/manage');
			}
	});
});


module.exports = router;