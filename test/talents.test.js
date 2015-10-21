'use strict';
var assert = require('assert'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    users = require('../models/users'),
    characters = require('../models/characters'),
    talents = require('../models/talents'),
    testCharacter,
    testUser,
	testTalent;

describe('Talents Test Suite', function() {
	before('Create a test user, test character and test talent for use in other tests in this suite', function(done) {
		users.createUser('heck', 'heckWord', function(err, user) {
			if(err) throw new Error(err);
			else {
				testUser = user;
				characters.createCharacter('Clark Kent', 'Superman', 'the man of steel', 500, 'testingcharacter', 10, function(err, character) {
				  	should.not.exist(err);
				  	should.exist(character); 
				  	testCharacter = character;
				});
			}

			talents.createTalent('testTalent', 15, true, [{name: 'Out of Combat', cost: 5}, {name: 'Intuition', cost: -5}, {name: 'Functions as a Sense', cost: 2}], function(err, talent) {
				should.not.exist(err);
				should.exist(talent);
				talent.should.have.property('name', 'testTalent');
				talent.should.have.property('cost', 15);
				talent.should.have.property('bonusToRoll', true);
				talent.should.have.property('adders');
				talent['adders'].should.be.Array;
				testTalent = talent;
				done();
			});
    	});
	});

	describe('talents.updateTalent()', function(done) {
		it('should update the specified talent', function() {
			talents.updateTalent(testTalent._id, {name: 'updatedTalent', cost: 9001}, function(err, talent) {
				should.not.exist(err);
				should.exist(talent);
				talent.should.have.property('name', 'updatedTalent');
				talent.should.have.property('cost', 9001);
				testTalent = talent;
				done();
			});
		});
	});

	describe('talents.listTalents()', function(done) {
		it('should list all the talents in the whole world (on the test db)', function() {
			talents.listTalents(function(err, results) {
				should.not.exist(err);
				should.exist(results);
				results.should.be.Array;
				(results[0]).should.be.Object;
				done();
			});
		});
	});

	describe('talents.getTalent()', function(done) {
		it('should fetch the talent that matches the given query', function() {
			talents.getTalent({_id: testTalent._id}, function(err, result) {
				should.not.exist(err);
				should.exist(result);
				result.should.be.Object;
				done();
			});
		});
	});
  
    // After test suite
	after('Clean up test user and test character', function(done) {
		characters.removeCharacter({ _id: testCharacter._id }, function(err, results) {
		  should.not.exist(err);
		  should.exist(results);
		});

		users.findUser({_id: testUser._id}, function(err, user) {
      		if (err) throw new Error(err);
      		else user.remove();
    	});

    	talents.deleteTalent(testTalent._id, function(err, talent) {
			should.not.exist(err);
			should.exist(talent);
		});

    	done();
	});
});