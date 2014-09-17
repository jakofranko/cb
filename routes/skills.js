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
			console.log(skill);
			res.render('skillTypeEdit', { title: 'Edit ' + skill.name, skill: skill })
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
		var purchasableAsGroupList = [];
		var subCategoryList = [];
		var category = /^category\d{1,2}$/;
		var purchasableAsGroup = /^category\d{1,2}purchasable$/;
		var subCategory = /^category\d{1,2}sub\d{1,2}$/;

		// combs through the posted data, and adds categories, subcategories, and the checkboxes that indicate that the category is purchasable by group to the arrays that have been initialized at the beginning of this function. This is done by regex matching the form elements.
		for(var key in req.body) {
			if(key.match(category) != null) {
				categoryList.push([key, req.body[key]]);
			} else if(key.match(subCategory) != null) {
				subCategoryList.push([key, req.body[key]]);
			} else if(key.match(purchasableAsGroup) != null) {
				purchasableAsGroupList.push([key, req.body[key]]);
			}
		}

		// A regular expression that will grab the category number from an element
		var getCategoryNum = /^category(\d{1,2})/;
		categoryList.forEach(function(value, index, list) {

			// gets the current category number, and then adds the current category as an object to the main category array that will be added to the database.
			var catNum = list[index][0].match(getCategoryNum)[1];
			categories[index] = ({ name: list[index][1], subcategories: [] });

			// Loops through the subcategory list, and if the category number matches the current category number, the sub category is added to the categories.subcategories array
			subCategoryList.forEach(function(val, ind, sub) {

				var subCatNum = sub[ind][0].match(getCategoryNum)[1];
				if(subCatNum == catNum) {
					categories[index].subcategories.push(sub[ind][1]);
				}

			});

			// Goes through the purchasable list. If the category number matches the current category number, then the current category is given a property of purchasableAsGroup = true
			var setCategorypurchasable = false;
			purchasableAsGroupList.forEach(function(v, i, purchasable) {

				var purchasableNum = purchasable[i][0].match(getCategoryNum)[1];
				if(purchasableNum == catNum) {
					setCategorypurchasable = true;
				}

			});

			if(setCategorypurchasable == true) {
				categories[index].purchasableAsGroup = true;
			} else {
				categories[index].purchasableAsGroup = false;
			}

		});
	}
	//console.log(categories, req.body);
	skillTypes.createSkillType(req.body.skill, req.body.type, req.body.associatedCharacteristic, req.body.baseCost, req.body.basePlusOne, categories, function(err, result) {
		if(err) throw new Error(err);
		else res.redirect('/skills/create');
	});
});

router.post('/updateSkillType', function(req, res) {
	console.log('Req.body: ', req.body);
	var categories = [];

	var categoryList = [];
	var purchasableAsGroupList = [];
	var subCategoryList = [];
	var category = /^category\d{1,2}$/;
	var purchasableAsGroup = /^category\d{1,2}purchasable$/;
	var subCategory = /^category\d{1,2}sub\d{1,2}$/;

	// combs through the posted data, and adds categories, subcategories, and the checkboxes that indicate that the category is purchasable by group to the arrays that have been initialized at the beginning of this function. This is done by regex matching the form elements.
	for(var key in req.body) {
		if(key.match(category) != null) {
			categoryList.push([key, req.body[key]]);
		} else if(key.match(subCategory) != null) {
			subCategoryList.push([key, req.body[key]]);
		} else if(key.match(purchasableAsGroup) != null) {
			purchasableAsGroupList.push([key, req.body[key]]);
		}
	}
	console.log('categoryList: ', categoryList);
	console.log('subCategoryList: ', subCategoryList);
	console.log('purchasableAsGroupList: ', purchasableAsGroupList);

	// A regular expression that will grab the category number from an element
	var getCategoryNum = /^category(\d{1,2})/;
	categoryList.forEach(function(value, index, list) {

		// gets the current category number, and then adds the current category as an object to the main category array that will be added to the database.
		var catNum = list[index][0].match(getCategoryNum)[1];
		categories[index] = ({ name: list[index][1], subcategories: [] });

		// Loops through the subcategory list, and if the category number matches the current category number, the sub category is added to the categories.subcategories array
		subCategoryList.forEach(function(val, ind, sub) {

			var subCatNum = sub[ind][0].match(getCategoryNum)[1];
			if(subCatNum == catNum) {
				categories[index].subcategories.push(sub[ind][1]);
			}

		});

		// Goes through the purchasable list. If the category number matches the current category number, then the current category is given a property of purchasableAsGroup = true
		var setCategorypurchasable = false;
		purchasableAsGroupList.forEach(function(v, i, purchasable) {

			var purchasableNum = purchasable[i][0].match(getCategoryNum)[1];
			if(purchasableNum == catNum) {
				setCategorypurchasable = true;
			}

		});

		if(setCategorypurchasable == true) {
			categories[index].purchasableAsGroup = true;
		} else {
			categories[index].purchasableAsGroup = false;
		}

	});
	console.log('Categories: ', categories);
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
				console.log('Error: ' + err, 'Updated Skill: ' + updatedSkill);
				res.redirect('/skills/manage');
			}
	});
});


module.exports = router;