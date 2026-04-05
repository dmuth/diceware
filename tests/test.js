
var should = require('should');

var lib = require("../src/lib.js")();
var dice = require("../src/dice.js")();


describe("Diceware", function() {

	describe("getRandomValue()", function() {

		it("Should pass", function() {

			(() => lib.getRandomValue(-1))
    			.should.throw(/max must be a non-negative integer/);

			lib.getRandomValue(0).should.be.aboveOrEqual(0);
			lib.getRandomValue(1).should.be.aboveOrEqual(0).and.lessThanOrEqual(1);
			lib.getRandomValue(999).should.be.aboveOrEqual(0).and.lessThanOrEqual(999);

		});

	});


	describe("getBase6()", function() {
		it("Better pass", function() {

			dice.getBase6(0, 1).should.containDeepOrdered([0]);
			dice.getBase6(1, 1).should.containDeepOrdered([1]);
			dice.getBase6(5, 1).should.containDeepOrdered([5]);
			dice.getBase6(6, 2).should.containDeepOrdered([1, 0]);
			dice.getBase6(12, 2).should.containDeepOrdered([2, 0]);
			dice.getBase6(35, 2).should.containDeepOrdered([5, 5]);
			dice.getBase6(36, 3).should.containDeepOrdered([1, 0, 0]);
			dice.getBase6(180, 3).should.containDeepOrdered([5, 0, 0]);
			dice.getBase6(215, 3).should.containDeepOrdered([5, 5, 5]);
			dice.getBase6(216, 4).should.containDeepOrdered([1, 0, 0, 0]);
			dice.getBase6(1080, 4).should.containDeepOrdered([5, 0, 0, 0]);
			dice.getBase6(1295, 4).should.containDeepOrdered([5, 5, 5, 5]);
			dice.getBase6(7775, 5).should.containDeepOrdered([5, 5, 5, 5, 5]);
			dice.getBase6(46655, 6).should.containDeepOrdered([5, 5, 5, 5, 5, 5]);
			dice.getBase6(279935, 7).should.containDeepOrdered([5, 5, 5, 5, 5, 5, 5]);
			dice.getBase6(1679615, 8).should.containDeepOrdered([5, 5, 5, 5, 5, 5, 5, 5]);

			should.throws(function() { dice.getBase6(6, 1) }, /Value too large/);
			should.throws(function() { dice.getBase6(36, 2) }, /Value too large/);
			should.throws(function() { dice.getBase6(216, 3) }, /Value too large/);
			should.throws(function() { dice.getBase6(-1, 1) }, /Value cannot be negative/);

		});
	});


	describe("convertBase6ToDice()", function() {
		it("Oughta pass", function() {

			dice.convertBase6ToDice([0], 1).should.containDeepOrdered([1]);
			dice.convertBase6ToDice([5], 1).should.containDeepOrdered([6]);
			dice.convertBase6ToDice([1, 0], 2).should.containDeepOrdered([2, 1]);
			dice.convertBase6ToDice([2, 0], 2).should.containDeepOrdered([3, 1]);
			dice.convertBase6ToDice([5, 5], 2).should.containDeepOrdered([6, 6]);
			dice.convertBase6ToDice([1, 0, 0], 3).should.containDeepOrdered([2, 1, 1]);
			dice.convertBase6ToDice([5, 0, 0], 3).should.containDeepOrdered([6, 1, 1]);
			dice.convertBase6ToDice([5, 5, 5], 3).should.containDeepOrdered([6, 6, 6]);
			dice.convertBase6ToDice([1, 0, 0, 0], 4).should.containDeepOrdered([2, 1, 1, 1]);
			dice.convertBase6ToDice([5, 0, 0, 0], 4).should.containDeepOrdered([6, 1, 1, 1]);
			dice.convertBase6ToDice([5, 5, 5, 5], 4).should.containDeepOrdered([6, 6, 6, 6]);
			dice.convertBase6ToDice([5, 5, 5, 5, 5], 5).should.containDeepOrdered([6, 6, 6, 6, 6]);
			dice.convertBase6ToDice([5, 5, 5, 5, 5, 5], 6).should.containDeepOrdered([6, 6, 6, 6, 6, 6]);
			dice.convertBase6ToDice([5, 5, 5, 5, 5, 5, 5], 7).should.containDeepOrdered([6, 6, 6, 6, 6, 6, 6]);
			dice.convertBase6ToDice([5, 5, 5, 5, 5, 5, 5, 5], 8).should.containDeepOrdered([6, 6, 6, 6, 6, 6, 6, 6]);

			should.throws(function() { dice.convertBase6ToDice([-1], 1); }, /negative/, "Negative value");
			should.throws(function() { dice.convertBase6ToDice([0, -1], 2); }, /negative/, "Negative value");
			should.throws(function() { dice.convertBase6ToDice([-1, 0], 2); }, /negative/, "Negative value");
			should.throws(function() { dice.convertBase6ToDice([6], 1); }, /too large/, "too large");
			should.throws(function() { dice.convertBase6ToDice([6, 0], 2); }, /too large/, "too large");
			should.throws(function() { dice.convertBase6ToDice([0, 6], 2); }, /too large/, "too large");

			should.throws(function() { dice.convertBase6ToDice([0], 2); }, /mismatch/i, "Mismatch");
			should.throws(function() { dice.convertBase6ToDice([0, 0], 1); }, /mismatch/i, "Mismatch");

		});
	});


	describe("getNumValuesFromNumDice() and rollDice()", function() {
		it("Gotta pass", function() {

			dice.getNumValuesFromNumDice(1).should.equal(6);
			dice.getNumValuesFromNumDice(2).should.equal(36);
			dice.getNumValuesFromNumDice(3).should.equal(216);
			dice.getNumValuesFromNumDice(4).should.equal(1296);
			dice.getNumValuesFromNumDice(5).should.equal(7776);
			dice.getNumValuesFromNumDice(6).should.equal(46656);
			dice.getNumValuesFromNumDice(7).should.equal(279936);
			dice.getNumValuesFromNumDice(8).should.equal(1679616);

			should.throws(() => { dice.getNumValuesFromNumDice(0); }, /zero/, "Zero");
			should.throws(() => { dice.getNumValuesFromNumDice(-1); }, /negative/, "Negative value");

			dice.rollDice(1).roll.length.should.be.equal(1);
			dice.rollDice(3).roll.length.should.be.equal(3);
			dice.rollDice(8).roll.length.should.be.equal(8);

			dice.rollDice(3).value.should.be.a.Number;
			dice.rollDice(8).value.should.be.a.Number;
			should.throws(() => { dice.rollDice(0); }, /zero/, "Zero");
			should.throws(() => { dice.rollDice(-1); }, /negative/, "Negative value"	);

		});
	});

	describe("convertBigNumberToString()", function() {
		it("Please pass", function() {

            lib.convertBigNumberToString(6 * Math.pow(10, 6)).should.equal("6 million");
            lib.convertBigNumberToString(60 * Math.pow(10, 9)).should.equal("60 billion");
            lib.convertBigNumberToString(600 * Math.pow(10, 12)).should.equal("600 trillion");
            lib.convertBigNumberToString(1 * Math.pow(10, 15)).should.equal("1 quadrillion");
            lib.convertBigNumberToString(123 * Math.pow(10, 18)).should.equal("123 quintillion");

            lib.convertBigNumberToString(6e+6).should.equal("6 million");
            lib.convertBigNumberToString(50E+9).should.equal("50 billion");

            lib.convertBigNumberToString("7e+6").should.equal("7 million");
            lib.convertBigNumberToString("51E+9").should.equal("51 billion");
            lib.convertBigNumberToString("512E+18").should.equal("512 quintillion");
            lib.convertBigNumberToString("513E+21").should.equal("513 sextillion");
            lib.convertBigNumberToString("514E+24").should.equal("514 septillion");
            lib.convertBigNumberToString("515E+27").should.equal("515 octillion");
            lib.convertBigNumberToString("516E+30").should.equal("516 nonillion");

        });

    });

});
