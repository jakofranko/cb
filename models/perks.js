var mongoose = require('mongoose'),
	users = require('./users');

var perkSchema = mongoose.Schema({
	name: String,
	minCost: Number,
	maxCost: Number
});

var Perk = mongoose.model('Perk', perkSchema);

module.exports = {
	createPerk: function(name, costs, callback) {
		var perk = new Perk({
			name: name,
			minCost: costs.minCost,
			maxCost: costs.maxCost
		});
		perk.save(function(err, success) {
			if(err) callback(err);
			else callback(err, success);
		});
	},

	listPerks: function(callback) {
		Perk.find({}, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	deletePerk: function(perkID, callback) {
		Perk.findByIdAndRemove(perkID, function(err, success) {
			if(err) callback(err);
			else callback(err, success);
		});
	},

	updatePerk: function(query, updates, callback) {
		Perk.findOneAndUpdate(query, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	}
}