var mongoose = require('mongoose'),
	characters = require('./characters');

var maneuverSchema = mongoose.Schema({
	name: String,	// Custom Name
	type: String,	// Name of martial maneuver
	ocv: String,
	dcv: String,
	cost: Number
});

var martialArtSchema = mongoose.Schema({
	characterID: String,
	name: String,
	maneuvers: [maneuverSchema]
});



var MartialArt = mongoose.model('MartialArt', martialArtSchema);

module.exports = {
	createMartialArt: function(name, characterID, callback) {
		var martialArt = new MartialArt({
			characterID: characterID,
			name: name,
			maneuvers: []
		});

		martialArt.save(function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	listMartialArts: function(characterID, callback) {
		MartialArt.find({characterID: characterID}, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		})
	},

	updateMartialArt: function(callback) {

	},

	removeMartialArt: function(maID, callback) {
		MartialArt.findByIdAndRemove(maID, function(err, ma) {
			if(err) callback(err);
			else callback(err, ma);
		});
	}

}