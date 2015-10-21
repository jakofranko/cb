var mongoose = require('mongoose');

var PerkSchema = mongoose.Schema({
	name: String,
	cost: Number,
	bonusToRoll: Boolean,
	addres: [TalentAdderSchema]
});

var TalentAdderSchema = mongoose.Schema({
	name: String,
	cost: Number
});