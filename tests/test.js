
var assert = require('assert');
var should = require('should');

var Promise = require("bluebird");

var diceware = require("../src/lib.js")



describe("Diceware", function() {
	describe("getRandomValue()", function(done) {

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
});


/*
TEST/TODO: Things to refactor:
X Diceware.getRandomValue
- Diceware.getBase6
- Diceware.convertBase6ToDice
- Diceware.getNumValuesFromNumDice
- Diceware.rollDice(1).roll.length
*/

