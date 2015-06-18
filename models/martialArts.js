var mongoose = require('mongoose'),
	characters = require('./characters');

var maneuverSchema = mongoose.Schema({
	name: String,	// Custom Name
	type: Object	// MartialManever model
});

var martialArtSchema = mongoose.Schema({
	name: String,
	characterID: String,
	maneuvers: [maneuverSchema]
});



var MartialArt = mongoose.model('MartialArt', martialArtSchema);


module.exports = {
	createMartialArt: function(name, characterID, maneuvers, callback) {
		var martialArt = new MartialArt({
			characterID: characterID,
			name: name,
			maneuvers: maneuvers
		});

		// Save. On success, update the character's point total.
		martialArt.save(function(err, results) {
			if(err) callback(err);
			else {
				var cost = 0;
				for(var k in maneuvers) {
					console.log("test");
					cost += maneuvers[k].type.cost;
					if((Number(k) + 1) == maneuvers.length) {
						characters.updateSpentPoints(characterID, -cost, function(err, result) {
							callback(err, result);	
						})
					}
				}
			}
		});
	},

	getMartialArt: function(maID, callback) {
		MartialArt.findById(maID, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},

	listMartialArts: function(characterID, callback) {
		MartialArt.find({characterID: characterID}, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		})
	},

	updateMartialArt: function(query, updates, callback) {
		MartialArt.findOneAndUpdate(query, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},

	removeMartialArt: function(maID, callback) {
		MartialArt.findByIdAndRemove(maID, function(err, ma) {
			if(err) callback(err);
			else callback(err, ma);
		});
	},

	addMartialManeuver: function(maID, mmName, mm, callback) {
		MartialArt.findById(maID, function(err, ma) {
			if(ma && ma.length !== 0) {
				var maneuver = {
					name: mmName,
					type: mm
				};
				ma.maneuvers.push(maneuver);
				ma.save(function(err) {
					callback(err, ma);
				});
			} else {
				callback('No martial art was found');
			}
		});
	},

	removeMartialManeuver: function(maID, mmID, callback) {
		MartialArt.findById(maID, function(err, ma) {
			if(ma && ma.length !== 0) {
				var doc = ma.maneuvers.id(mmID).remove();
				ma.save(function(err) {
					if(err)
						callback(err);
					else
						callback(err, ma);
				})
			}
		});
	}

}