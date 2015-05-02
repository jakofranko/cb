'use strict';
var assert = require('assert'),
    skillType = require('../models/skillType'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testSkill;

describe('Skill Test Suite', function() {
	describe('createSkillType', function() {
		it('should create a new skill type', function(done) {
			skillType.createSkillType('Acrobatics', 'Agility', 'DEX', 3, 2, null, function(err, skill) {
				should.not.exist(err);
				should.exist(skill);
				done();
			});
		});
	});

	describe('createSkillType Again', function() {
		it('should create a new skill type, different from the previous test', function(done) {
			skillType.createSkillType('Tank Fighting', 'Combat', 'STR', 2, 2, null, function(err, skill) {
				should.not.exist(err);
				should.exist(skill);
				done();
			});
		});
	});

	describe('findSkillType', function() {
		it('should select a single skill type', function(done) {
			skillType.findSkillType({ skill: 'Acrobatics' }, function(err, singleSkill) {
				should.exist(singleSkill);
				should.not.exist(err);
				done();
			});
		});
	});

	describe('updateSkillType', function() {
		it('should select a single skill type', function(done) {
			skillType.updateSkillType({ skill: 'Acrobatics' }, { type: 'your mother' }, function(err, updatedSkill) {
				should.exist(updatedSkill);
				should.not.exist(err);
				done();
			});
		});
	});

	describe('listSkillTypes', function() {
		it('should list all of the created skill types', function(done) {
			skillType.listSkillTypes(function(err, skillTypes) {
				should.exist(skillTypes);
				skillTypes.should.be.Array;
				skillTypes.length.should.be.above(2)
				should.not.exist(err);
				done();
			});
		});
	});

	describe('removeSkillType', function() {
		it('should remove a skill based on the query used (All skillTypes with name "Acrobatics")', function(done) {
			skillType.removeSkillType({ name: 'Acrobatics' }, function(err, success) {
				should.not.exist(err);
				should.exist(success);
				success.should.be.equal('success');
				done();
			});
		});
	});

	describe('removeSkillType Again', function() {
		it('should remove a skill based on the query used (All skillTypes with name "Tank Fighting")', function(done) {
			skillType.removeSkillType({ name: 'Tank Fighting' }, function(err, success) {
				should.not.exist(err);
				should.exist(success);
				success.should.be.equal('success');
				done();
			});
		});
	});
});