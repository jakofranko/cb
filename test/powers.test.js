'use strict';
var assert = require('assert'),
	should = require('should'),
	mongoose = require('mongoose'),
	powers = require('../models/powers.js'),
	db = mongoose.connections;

var testPower;

describe('Powers Test Suite', function() {
	describe('powers.createPower', function() {
		it('should add a new power with the parameteres given', function(done) {
			powers.createPower('Energy Blast', {points: 5, per: '1d6 of Energy Blast'}, 'Instant', 'Target\'s DCV', 'Standard Range', function(err, power) {
				should.not.exist(err);
				should.exist(power);
				power.should.have.property('name', 'Energy Blast');
				power.should.have.property('cost');
				(power.cost).should.be.Object;
				(power.cost).should.have.property('points', 5);
				(power.cost).should.have.property('per', '1d6 of Energy Blast');
				power.should.have.property('duration', 'Instant');
				power.should.have.property('target', 'Target\'s DCV');
				power.should.have.property('range', 'Standard Range');

				testPower = power;
				done();
			});
		});
	});

	describe('powers.updatePower', function() {
		it('should update an existing power with the parameteres given', function(done) {
			var updates = {
				name: 'Awesome Blash',
				cost: {points: 7, per: '1d6 of Awesome Blash'},
				duration: 'Constant',
				target: 'Target\'s EDCV',
				range: 'Self Only'
			};
			powers.updatePower(testPower._id, updates, function(err, updatedPower) {
				should.not.exist(err);
				should.exist(updatedPower);
				updatedPower.should.have.property('name', 'Awesome Blash');
				updatedPower.should.have.property('cost');
				(updatedPower.cost).should.be.Object;
				(updatedPower.cost).should.have.property('points', 7);
				(updatedPower.cost).should.have.property('per', '1d6 of Awesome Blash');
				updatedPower.should.have.property('duration', 'Constant');
				updatedPower.should.have.property('target', 'Target\'s EDCV');
				updatedPower.should.have.property('range', 'Self Only');

				testPower = updatedPower;
				done();
			});
		});
	});

	describe('powers.listPowers', function() {
		it('should list all powers', function(done) {
			powers.listPowers(function(err, powers) {
				should.not.exist(err);
				should.exist(powers);
				powers.should.be.Array;
				(powers.length).should.eql(1);
				done();
			});
		});
	});

	describe('powers.getPower', function() {
		it('should fetch a power with the query given', function(done) {
			powers.getPower({_id: testPower._id}, function(err, power) {
				should.not.exist(err);
				should.exist(power);
				power.should.have.property('name', 'Awesome Blash');
				power.should.have.property('cost');
				(power.cost).should.be.Object;
				(power.cost).should.have.property('points', 7);
				(power.cost).should.have.property('per', '1d6 of Awesome Blash');
				power.should.have.property('duration', 'Constant');
				power.should.have.property('target', 'Target\'s EDCV');
				power.should.have.property('range', 'Self Only');
				done();
			});
		});
	});

	describe('powers.removePower', function() {
		it('should delete a power', function(done) {
			powers.removePower(testPower._id, function(err, success) {
				should.not.exist(err);
				should.exist(success);
			});

			powers.getPower({_id: testPower._id}, function(err, power) {
				should.not.exist(err);
				should.not.exist(power);
				done();
			});
		});
	});
});