// TODO: Implement "experience points" and a disadvantage points system
// TODO: Skills, feats, talents, powers, perks, disadvantages
// TODO: figure out how to check cost of abilities vs base/experience/disadvantage pool. That might be front end validation, but would probably benefit from backend validation as well
var mongoose = require('mongoose'),
	users = require('./users');


var skillSchema = mongoose.Schema({
	skillType: Object,
	categories: Array,
	subcategories: Array,
	characteristicBased: Boolean,
	familiarity: Boolean,
	roll: Number,
	skillOptions: Object,
	cost: Number
});

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
	CV: Number,
	ECV: Number,
	Running: Number,
	Swimming: Number,
	Leap: Number,
	Skills: [skillSchema],
	skillEnhancers: Array,
	basePool: Number,
	pointsSpent: Number
});

var Character = mongoose.model('Character', characterSchema);

module.exports = {

	addSkill: function(characterID, skillType, categories, subcategories, characteristicBased, familiarity, roll, skillOptions, cost, callback) {
		Character.findOne({ _id: characterID }, function(err, character) {
			if(err) callback(err);
			else {
				character.Skills.push({
					skillType: skillType,
					categories: categories,
					subcategories: subcategories,
					characteristicBased: characteristicBased,
					familiarity: familiarity,
					roll: roll,
					skillOptions: skillOptions,
					cost: cost
				});
				character.save(callback);
			}
		});
	},
	
	// This will just supply the base values of the base characteristics, and will take name, alias, description and associated userID as arguments.
	// It will not at this point take any of the stat modifiers.
	createCharacter: function(name, alias, description, basePool, userID, baseChar, callback) {
		var character = new Character({ 
			name: name, 
			alias: alias, 
			description: description,
			basePool: basePool,
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
			STUNmod: 0,
			HTH: baseChar/5,
			Lift: Math.round((25)*Math.pow(2, (baseChar/5))),
			PreAtt: baseChar/5,
			CV: Math.round(baseChar/3),
			ECV: Math.round(baseChar/3),
			Running: 6,
			Swimming: 2,
			Leap: 2
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

	findSkill: function(charID, skillID, callback) {
		module.exports.findCharacterById(charID, function(err, character) {
			if(err) callback(err);
			else {
				var skill = character.Skills.id(skillID);
				callback(err, skill);
			}
		});
	},

	listSkillEnhancers: function() {
		var skillEnhancers = ['Jack of All Trades', 'Linguist', 'Scholar', 'Scientist', 'Scientist', 'Traveler', 'Well-Connected'];
		return skillEnhancers;
	},

	removeCharacter: function(condition, callback) {
		Character.remove(condition, callback);
	},

	removeSkill: function(charID, skillID, callback) {
		module.exports.findCharacterById(charID, function(err, character) {
			if(err) callback(err);
			else {
				var skill = character.Skills.id(skillID);
				var cost = skill.cost;

				// Removes the skill from the returned character
				skill.remove();

				// Update the spent points of the character
				module.exports.updateSpentPoints(character._id, cost, function(err, result) {
					if(err) callback(err);
					else return true;
				});

				character.save(function(err, character, numAffected) {
					if(err) callback(err);
					else { 
						callback(err, character, numAffected);
					}
				});
			}
		});
	},

	updateCharacter: function(query, updates, callback) {
		Character.findOneAndUpdate(query, updates, function(err, result) {
			if(err) callback(err);
			else callback(err, result);
		});
	},

	updateSkill: function(charID, skillID, updates, callback) {
		module.exports.findCharacterById(charID, function(err, character) {
			if(err) callback(err);
			else {
				character.Skills.id(skillID).categories = updates.categories;
				character.Skills.id(skillID).subcategories = updates.subcategories;
				character.Skills.id(skillID).cost = updates.cost;
				character.Skills.id(skillID).roll = updates.roll;
				character.Skills.id(skillID).familiarity = updates.familiarity;
				character.Skills.id(skillID).characteristicBased = updates.characteristicBased;
				character.Skills.id(skillID).skillOptions = updates.skillOptions;				
				character.save(function(err, result, numAffected) {
					callback(err, result, numAffected);
				});
			}
		});
	},

	updateSpentPoints: function(characterID, points, callback) {
		Character.findOne({ _id: characterID}, function(err, result) {
			if(err) callback(err);
			else if(result.pointsSpent) {
			// If there is already a pointsSpent field, then it subtracts the number from this field (if more points are spent, then it will increase. if something is sold back, it will decrease)
				result.pointsSpent -= points;
				result.save(function(err) {
					if(err) callback(err);
					else callback(err, result);
				});
			} else {
			// Otherwise, create the field by adding the points to the base pool. If the points number is negative, then it will subtract the number from the base pool
				result.pointsSpent = result.basePool + points;
				result.save(function(err) {
					if(err) callback(err);
					else callback(err, result);
				});
			}
		});
	}
}