// TODO: Implement a base point pool, "experience points" and a disadvantage points system
// TODO: Skills, feats, talents, powers, perks, disadvantages
// TODO: figure out how to check cost of abilities vs base/experience/disadvantage pool. That might be front end validation, but would probably benefit from backend validation as well
var mongoose = require('mongoose'),
	users = require('./users');

// Notes
//---------------------------
// The normal value of the base characteristics should almost always only be 10. Users will only edit the modifiers.
// Same goes with figured characteristics, except the base value will be 'figured' from the base characteristics.
// If a character buys Armor, then the RPD (resistant physical defense) or RED modifiers are adjusted.
// If a character converts some of their existing PD or ED into resistant, it will be subtracted from the base value and added to the mod value.
// Might need to add mod fields for the CV if I read the rules again and it looks like these can be directly augmented.
// PreAtt and HTH are the number of base d6 a character will get for those characteristics.
var	characterSchema = mongoose.Schema({
	name: String,
	alias: String,
	description: String,
	userID: String,
	STR: Number,
	STRmod: Number,
	DEX: Number,
	DEXmod: Number,
	INT: Number,
	INTmod: Number,
	CON: Number,
	CONmod: Number,
	BODY: Number,
	BODYmod: Number,
	EGO: Number,
	EGOmod: Number,
	PRE: Number,
	PREmod: Number,
	COM: Number,
	COMmod: Number,
	PD: Number,
	PDmod: Number,
	ED: Number,
	EDmod: Number,
	RPD: Number,
	RPDmod: Number,
	RED: Number,
	REDmod: Number,
	SPD: Number,
	SPDmod: Number,
	REC: Number,
	RECmod: Number,
	END: Number,
	ENDmod: Number,
	STUN: Number,
	STUNmod: Number,
	HTH: Number,
	Lift: Number,
	PreAtt: Number,
	OCV: Number,
	DCV: Number,
	ECV: Number
});

var Character = mongoose.model('Character', characterSchema);

module.exports = {
	
	// This will just supply the base values of the base characteristics, and will take name, alias, description and associated userID as arguments.
	// It will not at this point take any of the stat modifiers.
	createCharacter: function(name, alias, description, userID, baseChar, callback) {
		var character = new Character({ 
			name: name, 
			alias: alias, 
			description: description, 
			userID: userID,
			STR: baseChar,
			DEX: baseChar,
			INT: baseChar,
			CON: baseChar,
			EGO: baseChar,
			PRE: baseChar,
			COM: baseChar,
			BODY: baseChar,
			STRmod: 0,
			DEXmod: 0,
			INTmod: 0,
			CONmod: 0,
			EGOmod: 0,
			PREmod: 0,
			COMmod: 0,
			BODYmod: 0,
			PD: baseChar/5, 								// STR/5
			PDmod: 0,
			ED: baseChar/5,									// CON/5
			EDmod: 0,
			SPD: 1 + (baseChar/10),							// 1 + (DEX/10)
			SPDmod: 0,
			REC: (baseChar/5) + (baseChar/5),				// (STR/5) + (CON/5)
			RECmod: 0,
			END: 2 * baseChar,								// 2 * CON
			ENDmod: 0,
			STUN: baseChar + (baseChar/2) + (baseChar/2),	// BODY + (STR/2) + (CON/2)
			STUNmod: 0
		});

		character.save(function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	findCharacterByAlias: function(alias, callback) {
		Character.find({ alias: alias }, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	findCharacterById: function(charID, callback) {
		Character.findOne({ _id: charID }, function(err, results) {
			console.log(charID);
			if(err) callback(err);
			else callback(err, results);
		});
	},

	findCharacterByUserId: function(userID, callback) {
		Character.find({ userID: userID }, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},

	removeCharacter: function(condition, callback) {
		Character.remove(condition, callback);
	}
}