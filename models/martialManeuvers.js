var mongoose = require('mongoose');

var MartialManeuverSchema = mongoose.Schema({
	name: String,
	phase: String,
	ocv: String,
	dcv: String,
	cost: Number,
	effects: String
});
	
var MartialManeuver = mongoose.model('MartialManeuver', MartialManeuverSchema);

module.exports = {
	createMartialManeuver: function(name, phase, ocv, dcv, cost, effects, callback) {
		var martialManeuver = new MartialManeuver({
			name: name,
			phase: phase,
			ocv: ocv,
			dcv: dcv,
			cost: cost,
			effects: effects
		});

		martialManeuver.save(function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	listMartialManeuvers: function(callback) {
		MartialManeuver.find({}, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		})
	},

	updateMartialManeuver: function(query, updates, callback) {
		MartialManeuver.findOneAndUpdate(query, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},

	removeMartialManeuver: function(maID, callback) {
		MartialManeuver.findByIdAndRemove(maID, function(err, ma) {
			if(err) callback(err);
			else callback(err, ma);
		});
	}

}