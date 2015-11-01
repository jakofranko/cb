// This establishes the test database connection because it is the first test to run in the suite
// 'use strict';
var assert = require('assert'),
    characters = require('../models/characters'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should');
var testUser;
var testCharacter;
var testPerk;
var testTalent;

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
      characters.updateCharacter({ alias: 'Superman' }, { description: 'a complete doofus' }, false, function(err, result) {
        should.exist(result);
        (result === null).should.not.be.true;
        should.not.exist(err);
        done();
      });
    });
  });

  // Skills
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

  // Perks
  describe('characters.addPerk', function() {
    it('should add a perk to the character', function(done) {
      var perk = {
        name: 'Master of Spies',
        type: { name: 'Contact', minCost: 1, maxCost: 0 },
        cost: 3,
        perkOptions: { gmOffset: 2, slavishlyLoyal: true, base11Contact: true, rollBonus: 2 }
      };

      characters.addPerk(testCharacter._id, perk, function(err, newPerk) {
        should.not.exist(err);
        should.exist(newPerk);
        newPerk.should.have.property('name');
        newPerk.should.have.property('type');
        newPerk.should.have.property('cost');
        (newPerk.cost).should.eql(3);
        newPerk.should.have.property('perkOptions');
        testPerk = newPerk;
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          done();
        });
      });
    });
  });

  describe('characters.updatePerk', function() {
    it('should update a perk to the character', function(done) {
      var update = {
        name: 'Master Spy',
        cost: 5,
        perkOptions: { gmOffset: 1, base11Contact: true, rollBonus: 3 }
      };

      (testCharacter.pointsSpent).should.eql(3);

      characters.updatePerk(testCharacter._id, testPerk._id, update, function(err, updatedPerk) {
        should.not.exist(err);
        should.exist(updatedPerk);
        updatedPerk.should.have.property('name');
        (updatedPerk.name).should.eql('Master Spy');
        updatedPerk.should.have.property('type');
        updatedPerk.should.have.property('cost');
        (updatedPerk.cost).should.eql(5);
        updatedPerk.should.have.property('perkOptions');
        (updatedPerk.perkOptions).should.have.property('gmOffset');
        (updatedPerk.perkOptions.gmOffset).should.eql(1);
        (updatedPerk.perkOptions).should.have.property('base11Contact');
        (updatedPerk.perkOptions).should.have.property('rollBonus');
        (updatedPerk.perkOptions.rollBonus).should.eql(3);
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          (testCharacter.pointsSpent).should.eql(5);
          done();
        });
      });
    });
  });

  describe('characters.removePerk', function() {
    it('should remove the specified perk from the specified character', function(done) {
      (testCharacter.pointsSpent).should.eql(5);
      characters.removePerk(testCharacter._id, testPerk._id, function(err, success) {
        should.not.exist(err);
        should.exist(success);
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          (testCharacter.pointsSpent).should.eql(0);
          done();
        });
      });
    });
  });

  // Talents
  describe('characters.addTalent', function() {
    it('should add a talent to the character', function(done) {
      var talent = {
        name: 'Spidey-Sense',
        type: { name: 'Danger Sense', cost: 3, bonusToRoll: 0, adders: [{name: 'Intuitional', cost: -5}, {name: 'Any Area', cost: 10}, {name: 'Out of Combat', cost: 5}] },
        adders: ['Out of Combat'],
        bonusToRoll: 3,
        cost: 8
      };

      characters.addTalent(testCharacter._id, talent, function(err, newTalent) {
        should.not.exist(err);
        should.exist(newTalent);
        newTalent.should.have.property('name', 'Spidey-Sense');
        newTalent.should.have.property('type');
        newTalent.should.have.property('cost', 8);
        newTalent.should.have.property('adders');
        newTalent.should.have.property('bonusToRoll', 3);
        newTalent.adders.forEach(function(val, i) {
          var count = 0;
          for(var adder in newTalent.type.adders) {
            if(newTalent.adders[adder] == val) count++;
          }
          count.should.eql(1);
        });
        (newTalent.cost).should.eql(8);
        testTalent = newTalent;
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          (testCharacter.pointsSpent).should.eql(8);
          done();
        });
      });
    });
  });

  describe('characters.updateTalent', function() {
    it('should update a talent to the character', function(done) {
      var update = {
        name: 'Ultimate Spidey-Sense',
        adders: ['Any Area'],
        bonusToRoll: 5,
        cost: 13,
      };

      characters.updateTalent(testCharacter._id, testTalent._id, update, function(err, updatedTalent) {
        should.not.exist(err);
        should.exist(updatedTalent);
        updatedTalent.should.have.property('name', 'Ultimate Spidey-Sense');
        updatedTalent.should.have.property('type');
        updatedTalent.should.have.property('cost', 13);
        updatedTalent.should.have.property('bonusToRoll', 5);
        updatedTalent.should.have.property('adders');
        updatedTalent.adders.forEach(function(val, i) {
          var count = 0;
          for(var adder in updatedTalent.type.adders) {
            if(updatedTalent.adders[adder] == val) count++;
          }
          count.should.eql(1);
        });
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          (testCharacter.pointsSpent).should.eql(13);
          done();
        });
      });
    });
  });

  describe('characters.findTalent', function() {
    it('should fetch one single talent the character ID and the talent ID', function(done) {
      characters.findTalent(testCharacter._id, testTalent._id, function(err, talent) {
        should.not.exist(err);
        should.exist(talent);
        talent.should.have.property('name', 'Ultimate Spidey-Sense');
        done();
      });
    });
  });

  describe('characters.removeTalent', function() {
    it('should remove the specified talent from the specified character', function(done) {
      (testCharacter.pointsSpent).should.eql(13);
      characters.removeTalent(testCharacter._id, testTalent._id, function(err, success) {
        should.not.exist(err);
        should.exist(success);
        characters.findCharacterById(testCharacter._id, function(error, newCharacter) {
          testCharacter = newCharacter;
          (testCharacter.pointsSpent).should.eql(0);
          done();
        });
      });
    });
  });

  // Update points
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