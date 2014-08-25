// This is piggybacking of of db.test.js's mongoose connection. 
'use strict';
var assert = require('assert'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testUser;


describe('Users Suite:', function() {
  // Before test suite
  before(function() {

    users.createUser('heck', 'heckWord', function(err, user) {
      if(err) throw new Error(err);
      else testUser = user;
    });

  });

  // Mongoose xample save:

  // product.sold = Date.now();
  // product.save(function (err, product, numberAffected) {
  //   if (err) ..
  // })
  //
  // The callback will receive three parameters, err if an error occurred, product which is the saved product, and numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
  //
  // The fn callback is optional. If no fn is passed and validation fails, the validation error will be emitted on the connection used to create this model.


  // Begin Test suite  
  describe('user.findUserByName', function() {
    it("should find a user from the username passed to it", function(done) {
      users.findUserByName("heck", function(err, user) {
        should.exist(user);
        should.not.exist(err);
        done();
      });
    });
  });

  describe('users.authenticate', function() {
    it('should return a user, as this is the correct password and the user exists', function(done) {
      users.authenticate('heck', 'heckWord', function(err, authenticated) {
        should.not.exist(err);
        should.exist(authenticated);
        done();
      });
    });
  });

  describe('users.authenticate', function() {
    it('should return authenticated == false, because the user exists but the password is wrong', function(done) {
      users.authenticate({ username: 'heck' }, 'badPass', function(err, authenticated) {
        should.not.exist(err);
        authenticated.should.be.false;
        done();
      });
    });
  });

  describe('updateUser() ', function() {
    it('should update the User model based on the condition', function(done) {
      users.updateUser({ username: 'heck' }, { email: 'heck@heck.com', password: 'newPass' }, { new: true }, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        done();
      });
    });
  });

  // After test suite
  after(function() {
    users.findUserByName('heck', function(err, user) {
      if (err) throw new Error(err);
      else user.remove();
    });
  });


});