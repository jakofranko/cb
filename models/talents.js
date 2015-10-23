var mongoose = require('mongoose');

var TalentSchema = mongoose.Schema({
	name: String,
	cost: Number,
	bonusToRoll: Number,
	adders: [TalentAdderSchema]
});

var TalentAdderSchema = mongoose.Schema({
	name: String,
	cost: Number
});

var Talent = mongoose.model('Talent', TalentSchema);

module.exports = {
	createTalent: function(name, cost, bonusToRoll, adders, callback) {
		var talent = new Talent({
			name: name,
			cost: cost,
			bonusToRoll: bonusToRoll,
			adders: adders
		});
		talent.save(function(err, success) {
			if(err) callback(err);
			else callback(err, success);
		});
	},
	updateTalent: function(id, updates, callback) {
		Talent.findByIdAndUpdate(id, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},
	getTalent: function(query, callback) {
		Talent.findOne(query, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},
	listTalents: function(callback) {
		Talent.find({}, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},
	deleteTalent: function(id, callback) {
		Talent.findByIdAndRemove(id, function(err, success) {
			if(err) callback(err);
			else callback(err, success);
		});
	}
}