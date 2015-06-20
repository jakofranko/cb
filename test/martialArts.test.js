'use strict';
var assert = require('assert'),
	martialManeuvers = require('../models/martialManeuvers'),
    martialArts = require('../models/martialArts'),
    characters = require('../models/characters'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testCharacter,
    testUser,
    testManeuver,
    testMartialArt;

describe('Martial Arts Test Suite', function() {
	before('Create a test user and a test character', function(done) {
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

			martialManeuvers.createMartialManeuver('Test Maneuver', "0.5", "+4", "-2", 5, "+15 INT vs dumbness", function(err, mm) {
				if(err) throw new Error(err);
				else {
					should.not.exist(err);
					should.exist(mm);
					testManeuver = mm;
				}
			});
			done();
    	});
	});

    describe('createMartialArt', function() {
		it('should create a new martial art', function(done) {
			var maneuvers = [
				{
					name: 'Frouisment',
					type: testManeuver
				}
			];
			martialArts.createMartialArt('Fencing', testCharacter._id, maneuvers, function(err, ma) {
				should.not.exist(err);
				should.exist(ma);
				testMartialArt = ma;
				done();
			});
		});
	});

	describe('getMartialArt', function() {
		it('should fetch one martial art by ID', function(done) {
			martialArts.getMartialArt(testMartialArt._id, function(err, result) {
				should.not.exist(err);
				should.exist(result);
				done();
			});
		});
	});

	describe('listMartialArts', function() {
		it('should list martial arts that belong to a character', function(done) {
			martialArts.listMartialArts(testCharacter._id, function(err, ma) {
				should.not.exist(err);
				should.exist(ma);
				done();
			});
		});
	});

	describe('updateMartialArt', function() {
		it('should update the specified art according the updates object', function(done) {
			martialArts.updateMartialArt({ _id: testMartialArt._id }, { name: 'Blah Blah Bar', maneuvers: [{ name: 'Stupid maneuver', type: testManeuver }]}, function(err, newMa) {
				should.not.exist(err);
				should.exist(newMa);
				testMartialArt = newMa;
				done();
			});
		});
	});

	describe('updateMartialArt', function() {
		it('should update the specified art according the updates object', function(done) {
			martialArts.updateMartialArt({ _id: testMartialArt._id }, { name: 'Blah Blah Bar', maneuvers: [{ name: 'Stupid maneuver', type: testManeuver }]}, function(err, result) {
				should.not.exist(err);
				should.exist(result);
				done();
			});
		});
	});

	describe('addMartialManeuver', function() {
		it('should add a martial maneuver to an existing martial art', function(done) {
			testMartialArt.maneuvers.length.should.eql(1);
			martialArts.addMartialManeuver(testMartialArt._id, 'Touche', testManeuver, function(err, updatedMa) {
				should.not.exist(err);
				should.exist(updatedMa);
				testMartialArt = updatedMa;
				testMartialArt.maneuvers.length.should.eql(2);
				done();
			});
		});
	});


	describe('removeMartialManeuver', function() {
		it('should remove a martial maneuver from an existing martial art', function(done) {
			testMartialArt.maneuvers.length.should.eql(2);
			martialArts.removeMartialManeuver(testMartialArt._id, testMartialArt.maneuvers[0]._id, function(err, updatedMa) {
				should.not.exist(err);
				should.exist(updatedMa);
				testMartialArt = updatedMa;
				testMartialArt.maneuvers.length.should.eql(1);
				done();
			});
		});
	});

	describe('removeMartialArt', function() {
		it('should remove the martial art specified by id', function(done) {
			martialArts.removeMartialArt(testMartialArt._id, function(err, martialArt) {
				should.not.exist(err);
				should.exist(martialArt);
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

    	martialManeuvers.removeMartialManeuver(testManeuver._id, function(err, martialManeuver) {
			should.not.exist(err);
			should.exist(martialManeuver);
		});
    
    	done();
	});
});