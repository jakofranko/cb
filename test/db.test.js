'use strict';
var assert = require('assert'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testUser;

describe('Database Connection Test:', function() {
  describe('db.on()', function() {
    it("should open should open database connection", function() {
      db.on('open', function() { 
        console.log("connection established");
        return true;
      });
      db.on('error', function() {
        console.error.bind(console, 'connection error:');
        return false;
      });
    });
  });
});