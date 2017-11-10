
var assert = require('assert');
var should = require('should');

var Promise = require("bluebird");

var diceware = require("../src/lib.js")


describe("Diceware", function() {

	describe("getRandomValue()", function() {

		it("Should pass", function(done) {

			Promise.try(function() {
				return(diceware.getRandomValue(-1));

			}).catch(function(err) {
				err.should.match(/can't be less or equal to zero/);
				return(diceware.getRandomValue(0));

			}).catch(function(err) {
				err.should.match(/can't be less or equal to zero/);
				return(diceware.getRandomValue(1));

			}).then(function(num) {
				num.should.be.aboveOrEqual(0);
				num.should.be.lessThanOrEqual(1);
				return(diceware.getRandomValue(999));

			}).then(function(num) {
				num.should.be.aboveOrEqual(0);
				num.should.be.lessThanOrEqual(999);
				done();

			}).catch(function(err) {
				done(err);

			});

		});

	});


	describe("getBase6()", function() {
		it("Better pass", function() {

			diceware.getBase6(0, 1).should.containDeepOrdered([0]);
			diceware.getBase6(1, 1).should.containDeepOrdered([1]);
			diceware.getBase6(5, 1).should.containDeepOrdered([5]);
			diceware.getBase6(6, 2).should.containDeepOrdered([1, 0]);
			diceware.getBase6(12, 2).should.containDeepOrdered([2, 0]);
			diceware.getBase6(35, 2).should.containDeepOrdered([5, 5]);
			diceware.getBase6(36, 3).should.containDeepOrdered([1, 0, 0]);
			diceware.getBase6(180, 3).should.containDeepOrdered([5, 0, 0]);
			diceware.getBase6(215, 3).should.containDeepOrdered([5, 5, 5]);
			diceware.getBase6(216, 4).should.containDeepOrdered([1, 0, 0, 0]);
			diceware.getBase6(1080, 4).should.containDeepOrdered([5, 0, 0, 0]);
			diceware.getBase6(1295, 4).should.containDeepOrdered([5, 5, 5, 5]);
			diceware.getBase6(7775, 5).should.containDeepOrdered([5, 5, 5, 5, 5]);
			diceware.getBase6(46655, 6).should.containDeepOrdered([5, 5, 5, 5, 5, 5]);
			diceware.getBase6(279935, 7).should.containDeepOrdered([5, 5, 5, 5, 5, 5, 5]);
			diceware.getBase6(1679615, 8).should.containDeepOrdered([5, 5, 5, 5, 5, 5, 5, 5]);

			should.throws(function() { diceware.getBase6(6, 1) }, /Value too large/);
			should.throws(function() { diceware.getBase6(36, 2) }, /Value too large/);
			should.throws(function() { diceware.getBase6(216, 3) }, /Value too large/);
			should.throws(function() { diceware.getBase6(-1, 1) }, /Value cannot be negative/);

		});
	});


	describe("convertBase6ToDice()", function() {
		it("Oughta pass", function() {

			diceware.convertBase6ToDice([0], 1).should.containDeepOrdered([1]);
			diceware.convertBase6ToDice([5], 1).should.containDeepOrdered([6]);
			diceware.convertBase6ToDice([1, 0], 2).should.containDeepOrdered([2, 1]);
			diceware.convertBase6ToDice([2, 0], 2).should.containDeepOrdered([3, 1]);
			diceware.convertBase6ToDice([5, 5], 2).should.containDeepOrdered([6, 6]);
			diceware.convertBase6ToDice([1, 0, 0], 3).should.containDeepOrdered([2, 1, 1]);
			diceware.convertBase6ToDice([5, 0, 0], 3).should.containDeepOrdered([6, 1, 1]);
			diceware.convertBase6ToDice([5, 5, 5], 3).should.containDeepOrdered([6, 6, 6]);
			diceware.convertBase6ToDice([1, 0, 0, 0], 4).should.containDeepOrdered([2, 1, 1, 1]);
			diceware.convertBase6ToDice([5, 0, 0, 0], 4).should.containDeepOrdered([6, 1, 1, 1]);
			diceware.convertBase6ToDice([5, 5, 5, 5], 4).should.containDeepOrdered([6, 6, 6, 6]);
			diceware.convertBase6ToDice([5, 5, 5, 5, 5], 5).should.containDeepOrdered([6, 6, 6, 6, 6]);
			diceware.convertBase6ToDice([5, 5, 5, 5, 5, 5], 6).should.containDeepOrdered([6, 6, 6, 6, 6, 6]);
			diceware.convertBase6ToDice([5, 5, 5, 5, 5, 5, 5], 7).should.containDeepOrdered([6, 6, 6, 6, 6, 6, 6]);
			diceware.convertBase6ToDice([5, 5, 5, 5, 5, 5, 5, 5], 8).should.containDeepOrdered([6, 6, 6, 6, 6, 6, 6, 6]);

			should.throws(function() { diceware.convertBase6ToDice([-1], 1); }, /negative/, "Negative value");
			should.throws(function() { diceware.convertBase6ToDice([0, -1], 2); }, /negative/, "Negative value");
			should.throws(function() { diceware.convertBase6ToDice([-1, 0], 2); }, /negative/, "Negative value");
			should.throws(function() { diceware.convertBase6ToDice([6], 1); }, /too large/, "too large");
			should.throws(function() { diceware.convertBase6ToDice([6, 0], 2); }, /too large/, "too large");
			should.throws(function() { diceware.convertBase6ToDice([0, 6], 2); }, /too large/, "too large");

			should.throws(function() { diceware.convertBase6ToDice([0], 2); }, /mismatch/i, "Mismatch");
			should.throws(function() { diceware.convertBase6ToDice([0, 0], 1); }, /mismatch/i, "Mismatch");

		});
	});


	describe("getNumValuesFromNumDice() and rollDice()", function() {
		it("Gotta pass", function(done) {

			Promise.try(function() {

				diceware.getNumValuesFromNumDice(1).should.equal(6);
				diceware.getNumValuesFromNumDice(2).should.equal(36);
				diceware.getNumValuesFromNumDice(3).should.equal(216);
				diceware.getNumValuesFromNumDice(4).should.equal(1296);
				diceware.getNumValuesFromNumDice(5).should.equal(7776);
				diceware.getNumValuesFromNumDice(6).should.equal(46656);
				diceware.getNumValuesFromNumDice(7).should.equal(279936);
				diceware.getNumValuesFromNumDice(8).should.equal(1679616);

				should.throws(function() { diceware.getNumValuesFromNumDice(0); }, /zero/, "Zero");
				should.throws(function() { diceware.getNumValuesFromNumDice(-1); }, /negative/, "Negative value");

				//
				// Test out our helper function first
				//
				return(diceware.rollDice(1));
			}).then(function(dice) {
	
				dice.roll.length.should.be.equal(1);
				return(diceware.rollDice(3));

			}).then(function(dice) {
				dice.roll.length.should.be.equal(3);
				return(diceware.rollDice(8));

			}).then(function(dice) {
				dice.roll.length.should.be.equal(8);

				//
				// These may fail infrequently if the random number is zero.
				//
				return(diceware.rollDice(3));

			}).then(function(dice) {
				parseInt(dice.value).should.ok;
				return(diceware.rollDice(8));
		
			}).then(function(dice) {
				parseInt(dice.value).should.ok;

				return(diceware.rollDice(0));

			}).catch(function(error) {
				error.should.match(/zero/);
				return(diceware.rollDice(-1));

			}).catch(function(error) {
				error.should.match(/negative/);

				done();

			}).catch(function(error) {
				done(error);

			});

		});
	});


});


/*
TEST/TODO: Things to refactor:
X Diceware.getRandomValue
X Diceware.getBase6
X Diceware.convertBase6ToDice
- Diceware.getNumValuesFromNumDice
- Diceware.rollDice(1).roll.length
*/

