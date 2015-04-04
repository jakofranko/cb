// This is piggybacking of of db.test.js's mongoose connection. 
// 'use strict';
var assert = require('assert'),
    characters = require('../models/characters'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should');
var testUser;
var testCharacter;

mongoose.connect('mongodb://localhost/cb-test');

describe('Character Suite:', function() {
  // Before test suite
  before("Create a test user and test character", function(done) {
    users.createUser('heck', 'heckWord', function(err, user) {
      if(err) throw new Error(err);
      else testUser = user;
    });
    done();
  });
  
  describe('characters.createCharacter()', function() {
    it('should create a character, taking name, alias, description, userID and a callback as arguments', function(done) {
      characters.createCharacter('Clark Kent', 'Superman', 'the man of steel', 500, 'testingcharacter', 10, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.have.property('name', 'Clark Kent');
        testCharacter = results;
        done();
      });
    });
  });

  describe('characters.findCharacterByAlias', function() {
    it("should return an array of characters from the alias passed to it", function(done) {
      characters.findCharacterByAlias('Superman', function(err, results) {
        should.exist(results);
        should.not.exist(err);
        done();
      });
    });
  });

  describe('characters.updateCharacter', function() {
    it('should update the character that matches the query passed to it', function(done) {
      characters.updateCharacter({ alias: 'Superman' }, { description: 'a complete doofus' }, function(err, result) {
        should.exist(result);
        (result === null).should.not.be.true;
        should.not.exist(err);
        done();
      });
    });
  });

  // Add a skill
  describe('characters.addSkill', function() {
    it('should add a skill to the selected character', function(done) {
      characters.addSkill(testCharacter._id, 'testSkill', ['testCategory'], ['subcat1', 'subcat2'], true, false, 14, ['options1', 'options2'], 9, function(err, newCharacter) {
        should.not.exist(err);
        should.exist(newCharacter);
        
        // Update testCharacter
        testCharacter.Skills = newCharacter.Skills;
        done();
      });
    });
  });

  describe('characters.removeSkill', function(done) {
    it('should remove the specified skill from the character', function(done) { 
      characters.removeSkill(testCharacter._id, testCharacter.Skills[0]._id, function(err, character, numAffected) {
        should.not.exist(err);
        should.exist(character);
        numAffected.should.be.equal(1);
        done();
      });
    });
  });

  describe('characters.updateSpentPoints', function() {
    it('should add or subtract the passed number from the character object', function(done) {
      characters.updateSpentPoints(testCharacter._id, -50, function(err, newTotal) {
        should.not.exist(err);
        should.exist(newTotal);
        done();
      });
    });
  });

  

  // After test suite
  after(function(done) {
    characters.removeCharacter({ _id: testCharacter._id }, function(err, results) {
      should.not.exist(err);
      should.exist(results);
    });

    users.findUser( {_id:testUser._id}, function(err, user) {
      if (err) throw new Error(err);
      else user.remove();
    });
    done();
  });
});