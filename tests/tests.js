
/**
* Our unit tests.
* Documentation on assert() can be found at https://api.qunitjs.com/category/assert/
*/

QUnit.module( "Diceware" );

QUnit.test("Test random numbers", function(assert) {

	assert.ok(isNaN(Diceware.getRandomValue(-1)), "Negative numbers should be NaN");
	assert.ok(isNaN(Diceware.getRandomValue(0)), "0 should be NaN");
	assert.equal(Diceware.getRandomValue(1), 0, "1 should be NaN");
	assert.ok(Diceware.getRandomValue(2) < 2, "getRandomValue(2) < 2");

});


QUnit.test("Base 6 conversion", function(assert) {

	assert.deepEqual(Diceware.getBase6(0, 1), [0]);
	assert.deepEqual(Diceware.getBase6(1, 1), [1]);
	assert.deepEqual(Diceware.getBase6(5, 1), [5]);
	assert.deepEqual(Diceware.getBase6(6, 2), [1, 0]);
	assert.deepEqual(Diceware.getBase6(12, 2), [2, 0]);
	assert.deepEqual(Diceware.getBase6(35, 2), [5, 5]);
	assert.deepEqual(Diceware.getBase6(36, 3), [1, 0, 0]);
	assert.deepEqual(Diceware.getBase6(180, 3), [5, 0, 0]);
	assert.deepEqual(Diceware.getBase6(215, 3), [5, 5, 5]);
	assert.deepEqual(Diceware.getBase6(216, 4), [1, 0, 0, 0]);
	assert.deepEqual(Diceware.getBase6(1080, 4), [5, 0, 0, 0]);
	assert.deepEqual(Diceware.getBase6(1295, 4), [5, 5, 5, 5]);

	assert.throws(function() {Diceware.getBase6(6, 1); }, /too large/, "Value too large");
	assert.throws(function() {Diceware.getBase6(36, 2); }, /too large/, "Value too large");
	assert.throws(function() {Diceware.getBase6(216, 3); }, /too large/, "Value too large");
	assert.throws(function() {Diceware.getBase6(-1, 1); }, /negative/, "Negative value");

});


QUnit.test("Convert Base 6 to Dice Roll", function(assert) {

	assert.deepEqual(Diceware.convertBase6ToDice([0], 1), [1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5], 1), [6]);
	assert.deepEqual(Diceware.convertBase6ToDice([1, 0], 2), [2, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([2, 0], 2), [3, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5, 5], 2), [6, 6]);
	assert.deepEqual(Diceware.convertBase6ToDice([1, 0, 0], 3), [2, 1, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5, 0, 0], 3), [6, 1, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5, 5, 5], 3), [6, 6, 6]);
	assert.deepEqual(Diceware.convertBase6ToDice([1, 0, 0, 0], 4), [2, 1, 1, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5, 0, 0, 0], 4), [6, 1, 1, 1]);
	assert.deepEqual(Diceware.convertBase6ToDice([5, 5, 5, 5], 4), [6, 6, 6, 6]);

	assert.throws(function() {Diceware.convertBase6ToDice([-1], 1); }, /negative/, "Negative value");
	assert.throws(function() {Diceware.convertBase6ToDice([0, -1], 2); }, /negative/, "Negative value");
	assert.throws(function() {Diceware.convertBase6ToDice([-1, 0], 2); }, /negative/, "Negative value");
	assert.throws(function() {Diceware.convertBase6ToDice([6], 1); }, /too large/, "too large");
	assert.throws(function() {Diceware.convertBase6ToDice([6, 0], 2); }, /too large/, "too large");
	assert.throws(function() {Diceware.convertBase6ToDice([0, 6], 2); }, /too large/, "too large");

	assert.throws(function() {Diceware.convertBase6ToDice([0], 2); }, /mismatch/i, "Mismatch");
	assert.throws(function() {Diceware.convertBase6ToDice([0, 0], 1); }, /mismatch/i, "Mismatch");

});


