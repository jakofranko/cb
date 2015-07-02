'use strict';
var assert = require('assert'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    users = require('../models/users'),
    characters = require('../models/characters'),
    perks = require('../models/perks'),
    testCharacter,
    testUser,
	testPerk;

describe('Perks Test Suite', function() {
	before('Create a test user, test character and test perk for use in other tests in this suite', function(done) {
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

			perks.createPerk('Test Perk', { minCost: 3, maxCost: 10 }, function(err, perk) {
				if(err) throw new Error(err);
				else {
					should.not.exist(err);
					should.exist(perk);
					perk.should.have.property('name');
					(perk.name).should.eql('Test Perk');
					perk.should.have.property('minCost');
					(perk.minCost).should.eql(3);
					perk.should.have.property('maxCost');
					(perk.maxCost).should.eql(10);
					testPerk = perk;
				}
			});

			done();
    	});
	});

	describe('getPerk', function() {
		it('should fetch one perk according to the query', function(done) {
			perks.getPerk({ name: 'Test Perk' }, function(err, result) {
				should.not.exist(err);
				should.exist(result);
				(result.name).should.eql('Test Perk');
				done();
			})
		})
	})

	describe('listPerks', function() {
		it('should list all perks in db', function(done) {
			perks.listPerks(function(err, perks) {
				should.not.exist(err);
				should.exist(perks);
				perks.should.be.Array;
				done();
			});
		});
	});

	describe('updatePerk', function() {
		it('should update a perk', function(done) {
			perks.updatePerk({_id: testPerk._id}, { name: 'Foo Bar Perk', minCost: 4, maxCost: 6 }, function(err, newPerk) {
				should.not.exist(err);
				should.exist(newPerk);
				newPerk.should.have.property('name');
				(newPerk.name).should.eql('Foo Bar Perk');
				newPerk.should.have.property('minCost');
				(newPerk.minCost).should.eql(4);
				newPerk.should.have.property('maxCost');
				(newPerk.maxCost).should.eql(6);
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

    	perks.deletePerk(testPerk._id, function(err, perk) {
			should.not.exist(err);
			should.exist(perk);
		});

    	done();
	});
});