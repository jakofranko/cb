'use strict';
var assert = require('assert'),
    users = require('../models/users'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    should = require('should'),
    testUser;

describe('Database Connection', function() {
  describe('Open the Database', function() {
    it("Should open should open database connection", function() {
      db.on('open', function() { return true; });
    });
  });
});