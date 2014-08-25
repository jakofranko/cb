// This is piggybacking of of db.test.js's mongoose connection. 
'use strict';
var assert = require('assert'),
    skillType = require('../models/skillType'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testSkill;

describe('Skill Test Suite', function() {
	describe('createSkillType', function() {
		it('should create a new skill type', function() {
			skillType.createSkillType('Acrobatics', 'Agility', 'DEX', 3, 2, null, function(err, skill) {
				should.not.exist(err);
				should.exist(skill);
			});
		});
	});

	describe('findSkillType', function() {
		it('should select a single skill type', function() {
			skillType.findSkillType({ skill: 'Acrobatics' }, function(err, singleSkill) {
				should.exist(singleSkill);
				should.not.exist(err);
			});
		});
	});

	describe('updateSkillType', function() {
		it('should select a single skill type', function() {
			skillType.updateSkillType({ skill: 'Acrobatics' }, { type: 'your mother' }, function(err, updatedSkill) {
				should.exist(updatedSkill);
				should.not.exist(err);
			});
		});
	});
});