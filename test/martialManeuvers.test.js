// This is piggybacking of of db.test.js's mongoose connection. 
'use strict';
var assert = require('assert'),
    martialManeuver = require('../models/martialManeuvers'),
    characters = require('../models/characters'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testCharacter,
    testUser,
    testMartialManeuver;

describe('Martial Maneuvers Test Suite', function() {
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
			done();
    	});
	});

    describe('createMartialManeuver', function() {
		it('should create a new martial maneuver', function(done) {
			martialManeuver.createMartialManeuver('Test Maneuver', 4, -2, 5, function(err, mm) {
				should.not.exist(err);
				should.exist(mm);
				testMartialManeuver = mm;
				done();
			});
		});
	});

	describe('listMartialManeuvers', function() {
		it('should list martial arts that belong to a character', function(done) {
			martialManeuver.listMartialManeuvers(function(err, ma) {
				should.not.exist(err);
				should.exist(ma);
				done();
			});
		});
	});

	describe('removeMartialManeuver', function() {
		it('should remove the martial art specified by id', function(done) {
			martialManeuver.removeMartialManeuver(testMartialManeuver._id, function(err, martialManeuver) {
				should.not.exist(err);
				should.exist(martialManeuver);
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
    
    	done();
	});
});