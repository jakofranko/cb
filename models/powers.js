var mongoose = require('mongoose');

var powerSchema = mongoose.Schema({
	name: String,
	cost: {
		points: Number,
		per: String
	},
	duration: String,
	target: String,
	range: String
});

var Power = mongoose.model('Power', powerSchema);

module.exports = {
	createPower: function(name, cost, duration, target, range, callback) {
		var power = new Power({
			name: name,
			cost: cost,
			duration: duration,
			target: target,
			range: range
		});

		power.save(function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},
	getPower: function(query, callback) {
		Power.findOne(query, function(err, power) {
			if(err) callback(err);
			else callback(err, power);
		});
	},
	listPowers: function(callback) {
		Power.find({}, function(err, powers) {
			if(err) callback(err);
			else callback(err, powers);
		})
	},
	removePower: function(powerID, callback) {
		Power.findByIdAndRemove(powerID, function(err, success) {
			if(err) callback(err);
			else callback(err, success);
		})
	},
	updatePower: function(powerID, updates, callback) {
		Power.findByIdAndUpdate(powerID, updates, {new: true}, function(err, updatedPower) {
			if(err) callback(err);
			else callback(err, updatedPower);
		});
	},
};