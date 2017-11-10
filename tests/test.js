
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


});


/*
TEST/TODO: Things to refactor:
X Diceware.getRandomValue
X Diceware.getBase6
- Diceware.convertBase6ToDice
- Diceware.getNumValuesFromNumDice
- Diceware.rollDice(1).roll.length
*/

