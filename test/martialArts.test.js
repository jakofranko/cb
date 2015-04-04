// This is piggybacking of of db.test.js's mongoose connection. 
'use strict';
var assert = require('assert'),
    martialArt = require('../models/martialArts'),
    characters = require('../models/characters'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testCharacter,
    testUser,
    testMartialArt;

describe('Martial Arts Test Suite', function() {
	users.createUser('heck', 'heckWord', function(err, user) {
		if(err) throw new Error(err);
		else {
			testUser = user;
			characters.createCharacter('Clark Kent', 'Superman', 'the man of steel', 500, 'testingcharacter', 10, function(err, character) {
			  	should.not.exist(err);
			  	should.exist(character); 
			  	testCharacter = character;

			  	describe('createMartialArt', function() {
					it('should create a new martial art', function(done) {
						martialArt.createMartialArt('Fencing', character._id, function(err, ma) {
							should.not.exist(err);
							should.exist(ma);
							testMartialArt = ma;
							done();
						});
					});
				});

				describe('listMartialArts', function() {
					it('should list martial arts that belong to a character', function(done) {
						martialArt.listMartialArts(character._id, function(err, ma) {
							should.not.exist(err);
							should.exist(ma);
							done();
						});
					});
				});

				describe('removeMartialArt', function() {
					it('should remove the martial art specified by id', function(done) {
						martialArt.removeMartialArt(testMartialArt._id, function(err, martialArt) {
							should.not.exist(err);
							should.exist(martialArt);
							done();
						})
					})
				})

			});
		}
    });

    // After test suite
	after(function() {
    
		characters.removeCharacter({ _id: testingcharacter._id }, function(err, results) {
		  should.not.exist(err);
		  should.exist(results);
		});

		users.findUser({_id: testUser._id}, function(err, user) {
      		if (err) throw new Error(err);
      		else user.remove();
    	});
    
	});
});