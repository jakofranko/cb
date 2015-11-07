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
			var newPower = {
				name: 'Energy Blast', 
				cost: {points: 5, per: '1d6 of Energy Blast'}, 
				duration: 'Instant', 
				target: 'Target\'s DCV', 
				range: 'Standard Range', 
				endurance: false,
				exclusiveVariants: false,
				category: ['Attack Power', 'Standard Power']
			};

			var variantOption = {
				name: 'Targeting Sense',
				cost: 3,
				incremental: true
			};
			var newVariantOne = {
				name: 'PD',
				exclusiveOptions: true,
				variantOptions: [variantOption, variantOption]
			};
			var newVariantTwo = {
				name: 'ED',
				description: 'Versus Energy Defense',
				cost: 100,
				incremental: false
			};
			

			newPower['variants'] = [newVariantOne, newVariantTwo];

			powers.createPower(newPower, function(err, power) {
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
				power.should.have.property('endurance', false);
				power.should.have.property('category');
				(power.category).should.be.Array;
				(power.category.indexOf('Standard Power')).should.not.eql(-1);
				(power.category.indexOf('Attack Power')).should.not.eql(-1);
				power.should.have.property('exclusiveVariants', false);

				power.should.have.property('variants');
				(power.variants.length).should.eql(2);

				(power.variants[0]).should.have.property('variantOptions');
				(power.variants[0]).should.have.property('name', 'PD');
				(power.variants[0]).should.have.property('exclusiveOptions', true);
				(power.variants[0].variantOptions.length).should.eql(2);
				(power.variants[0].variantOptions[0]).should.have.property('name', 'Targeting Sense');
				(power.variants[0].variantOptions[0]).should.have.property('cost', 3);
				(power.variants[0].variantOptions[0]).should.have.property('incremental', true);

				(power.variants[1]).should.have.property('name', 'ED');
				(power.variants[1]).should.have.property('description', 'Versus Energy Defense');
				(power.variants[1]).should.have.property('cost', 100);


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
				duration: null,
				target: 'Target\'s EDCV',
				range: 'Self Only',
				endurance: true
			};
			powers.updatePower(testPower._id, updates, function(err, updatedPower) {
				should.not.exist(err);
				should.exist(updatedPower);
				updatedPower.should.have.property('name', 'Awesome Blash');
				updatedPower.should.have.property('cost');
				(updatedPower.cost).should.be.Object;
				(updatedPower.cost).should.have.property('points', 7);
				(updatedPower.cost).should.have.property('per', '1d6 of Awesome Blash');
				updatedPower.should.have.property('duration', null);
				updatedPower.should.have.property('target', 'Target\'s EDCV');
				updatedPower.should.have.property('range', 'Self Only');
				updatedPower.should.have.property('endurance', true);

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
				power.should.have.property('duration', null);
				power.should.have.property('target', 'Target\'s EDCV');
				power.should.have.property('range', 'Self Only');
				power.should.have.property('endurance', true);
				done();
			});
		});
	});

	describe('powers.removePower', function() {
		it('should delete a power', function(done) {
			powers.listPowers(function(err, testPowers) {
				testPowers.forEach(function(power, i) {
					powers.removePower(power._id, function(err, success) {
						should.not.exist(err);
						should.exist(success);
					});

					if(i == testPowers.length - 1) {
						powers.getPower({_id: testPower._id}, function(err, power) {
							should.not.exist(err);
							should.not.exist(power);
							done();
						});
					}
				});
			});
		});
	});
});