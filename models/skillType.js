var mongoose = require('mongoose'),
	characters = require('./characters');

var skillCategorySchema = mongoose.Schema({
	name: String,
	subcategories: Array,
	purchasableAsGroup: Boolean
});

var skillTypeSchema = mongoose.Schema({
	skill: String,
	type: String,
	associatedCharacteristic: String,
	baseCost: Number,		// This is also the cost for one general category of a skill
	basePlusOne: Number,
	categories: [skillCategorySchema]
});



var SkillType = mongoose.model('SkillType', skillTypeSchema);

module.exports = {
	createSkillType: function(skill, type, associatedCharacteristic, baseCost, basePlusOne, categories, callback) {
		var skillType = new SkillType({
			skill: skill,
			type: type,
			associatedCharacteristic: associatedCharacteristic,
			baseCost: baseCost,
			basePlusOne: basePlusOne,
			categories: categories,
		});

		skillType.save(function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	findSkillType: function(query, callback) {
		SkillType.findOne(query, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		})
	},

	listSkillTypes: function(callback) {
		SkillType.find(null, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		})
	},

	removeSkillType: function(query, callback) {
		SkillType.remove(query, function(err) {
			if(err) callback(err);
			else callback(err, 'success');
		})
	},

	updateSkillType: function(query, updates, callback) {
		console.log('updateSkillType: ', query, updates);
		SkillType.findOneAndUpdate(query, updates, function(err, updatedSkill) {
			if(err) callback(err);
			else callback(err, updatedSkill);
		})
	}

	
}