var mongoose = require('mongoose'),
	characters = require('./characters');

var maneuverSchema = mongoose.Schema({
	name: String,	// Custom Name
	type: Object	// MartialManever model
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

	updateMartialArt: function(query, updates, callback) {
		findOneAndUpdate(query, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},

	removeMartialArt: function(maID, callback) {
		MartialArt.findByIdAndRemove(maID, function(err, ma) {
			if(err) callback(err);
			else callback(err, ma);
		});
	}

}