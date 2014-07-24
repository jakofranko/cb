// This is piggybacking of of db.test.js's mongoose connection. 
'use strict';
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
  before(function() {

    users.findUserByName('heck', function(err, user) {
      if (err) throw new Error(err);
      else if(user == null) console.log("user doesn't exist")
      else {
        user.remove(function(err, results) {
          should.not.exist(err);
          should.exist(results);
        });
      }
    });

    users.createUser('heck', 'heckWord', function(err, user) {
      if(err) throw new Error(err);
      else testUser = user;
    });


  });

  
  // Begin Test suite
  // describe('characters.create()', function() {
  //   it('should create a character subdoc for the user passed into the first argument', function() {
  //     users.updateUser({ username: 'heck'}, { characters: {name: 'J\'onn J\'onzz', alias: 'Martian Manhunter', description: 'founding member of the justice league'}}, function(err, results) {
  //       console.log(err, results);
  //       should.not.exist(err);
  //       should.exist(results);
  //     });        
  //   });
  // });

describe('characters.createCharacter()', function() {
    it('should create a character, taking name, alias, description, userID and a callback as arguments', function() {
      var userId = '';
      users.findUserByName('heck', function(err, user) {  // Grab the user id for use in building the character
        userId = user._id;
        should.not.exist(err);
        should.exist(user);

        characters.createCharacter('J\'onn J\'onzz', 'Martian Manhunter', 'founding member of the justice league', userId, 10, function(err, results) {
          should.not.exist(err);
          should.exist(results);
          results.should.have.property('name', 'J\'onn J\'onzz');  
        });

        characters.createCharacter('Clark Kent', 'Superman', 'the man of steel', userId, 10, function(err, results) {
          should.not.exist(err);
          should.exist(results);  
        });

        characters.createCharacter('Bruce Wayne', 'Batman', 'dark knight of gotham city', userId, 10, function(err, results) {
          should.not.exist(err);
          should.exist(results);  
        });

      });
    });
  });

  describe('characters.findCharacterByAlias', function() {
    it("should return an array of characters from the alias passed to it", function() {
      characters.findCharacterByAlias('Martian Manhunter', function(err, results) {
        should.exist(results);
        should.not.exist(err);
      });
    });
  });

  // Also having trouble getting this test to work

  // describe('characters.findCharacterById', function() {
  //   it('should find the character with the matching id', function() {
  //     var charID = '';
  //     characters.findCharacterByAlias('Batman', function(err, character) {

  //       characters.findCharacterById(''+character[0]._id+'', function(err, results) {
  //         console.log(err, results);
  //       });

  //     });
  //   });
  // });

  // This test is funky because of how I'm pulling the userID. I believe it works as of right now though...

  // describe('characters.findCharacterByUserId()', function() {
  //   it('should return an array of characters that match the userID passed to it', function() {
  //     var userId = "";
  //     users.findUserByName('heck', function(err, user) {  // Grab the user id for use in finding the characters
  //       userId = ''+user._id+'';
  //       should.not.exist(err);
  //       should.exist(user);

  //       characters.createCharacter('J\'onn J\'onzz', 'Martian Manhunter', 'founding member of the justice league', userId, function(err, results) {
  //         should.not.exist(err);
  //         should.exist(results);
  //         results.should.have.property('name', 'J\'onn J\'onzz');
  //         console.log(results.userID, userId);
  //         results.userID.should.equal(userId);
  //       });

  //       characters.createCharacter('Clark Kent', 'Superman', 'the man of steel', userId, function(err, results) {
  //         should.not.exist(err);
  //         should.exist(results);
  //         results.userID.should.equal(userId); 
  //       });

  //       characters.createCharacter('Bruce Wayne', 'Batman', 'dark knight of gotham city', userId, function(err, results) {
  //         should.not.exist(err);
  //         should.exist(results);
  //         results.userID.should.equal(userId); 
  //       });

  //       characters.findCharacterByUserId(''+userId+'', function(err, results) {
  //         should.not.exist(err);
  //         should.exist(results);
  //         console.log(results);
  //       });

  //     });
  //   });
  // });
 

  // After test suite
  after(function() {
    users.findUserByName('heck', function(err, user) {
      if (err) throw new Error(err);
      else user.remove();
    });

    characters.removeCharacter({ alias: 'Martian Manhunter' }, function(err, results) {
      should.not.exist(err);
      should.exist(results);
    });

    characters.removeCharacter({ alias: 'Batman' }, function(err, results) {
      should.not.exist(err);
      should.exist(results);
    });

    characters.removeCharacter({ alias: 'Superman' }, function(err, results) {
      should.not.exist(err);
      should.exist(results);
    });
  });

});