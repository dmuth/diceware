

var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");


/**
* Return true if we have a function that returns cryptographically random 
* values. False otherwise.
*/
module.exports.iCanHasGoodCrypto = iCanHasGoodCrypto = function() {

	//
	// If we don't have a Window variable, we're in Node.js, probably doing unit tests, so
	// return true.
	//
	// Even if I screw this up and there exists a web browser that doesn't have window defined
	// worst case is that a non-existant crypto.getRandomValues() function is called, and I'd rather
	// have some sort of error versus a user accidentally using weak crypto.
	//
	if (typeof(window) == "undefined") {
		return(true);
	}

	if (typeof(window) != "undefined") {
		if (window.crypto && window.crypto.getRandomValues) { 
			return(true);
		}
	}

	return(false);

} // End of i_can_has_good_crypto()


/**
* Return a random integer between 0 and max, inclusive.
*/
module.exports.getRandomValue = getRandomValue = function(max) {
	return new Promise(function(resolve, reject) {

	if (max <= 0) {
		reject("max can't be less or equal to zero!");
		return(null);
	}

	if (iCanHasGoodCrypto()) {

		Promise.try(function() {
			return randomNumber(0, max);

		}).then(function(number) {
			retval = number;
			resolve(retval);

		}).catch({code: "RandomGenerationError"}, function(err) {
			reject(err);

		});

	} else {
		//
		// Fall back to something way less secure.  The user has already 
		// been warned.
		//
		retval = Math.floor(Math.random() * max);
		resolve(retval);

	}

	}); // End of Promise()
} // End of getRandomValue()


/**
* Convert a number from base 10 into base 6.
*
* @param integer roll The random value.
* @param integer num_dice The number of dice we're returning.
*
* @return array An array of the base 6 numbers.
*/
module.exports.getBase6 = getBase6 = function(roll, num_dice) {

	var retval = [];

	//
	// Sanity check
	//
	var max_dice_roll = Math.pow(6, num_dice) - 1;
	if (roll > max_dice_roll) {
		throw(new Error("Value too large!"));
	}

	if (roll < 0) {
		throw(new Error("Value cannot be negative!"));
	}

	//
	// Go through each die, starting with the most significant one, and 
	// get its value.
	//
	var num_dice_left = num_dice - 1;
	var dice_value_left = roll;

	for (var i = num_dice_left; i >= 0; i--) {

		var die_value = Math.pow(6, i);
		var value = Math.floor( dice_value_left / die_value);
		var left = dice_value_left % die_value;

		retval.push(value);
		dice_value_left = dice_value_left - (die_value * value);

	}

	return(retval);

} // End of getBase6()


/**
* Convert a base-6 number to a dice roll
*
* @param array roll An array of integers in base-6 notation
* @param integer num_dice The number of dice rolled
*
* @return array An array of integers representing dice rolls
*/
module.exports.convertBase6ToDice = convertBase6ToDice = function(roll, num_dice) {

	var retval = [];

	if (roll.length != num_dice) {
		throw("Mismatch between size of roll (" + roll.length + ") and number of dice (" + num_dice + ")");
	}

	for (var k in roll) {
		var num = roll[k];

		if (num < 0) {
			throw("Value " + num + " is negative!");
		}

		if (num > 5) {
			throw("Value " + num + " is too large!");
		}

		num++;
		retval.push(num);
	}

	return(retval);

} // End of convertBase6ToDice()


/**
* Get the maximum value from the number of dice we're rolling.
* This is in a separate function so it is testable.
*/
module.exports.getNumValuesFromNumDice = getNumValuesFromNumDice = function(num_dice) {

	var retval;

	if (num_dice == 0) {
		throw("Number of dice cannot be zero!");

	} else if (num_dice < 0){
		throw("Number of dice is negative!");

	}

	retval = Math.pow(6, num_dice);

	return(retval);

} // End of getNumValuesFromNumDice()


/**
* This is our main entry point for rolling dice.
*
* Get our maximum number for a random value, turn it into base-6, 
* then turn it into a dice roll!
*
* @return object An object that contains a dice roll and the raw random value.
*
*/
module.exports.rollDice = rollDice = function(num_dice) {
	return new Promise(function(resolve, reject) {

		var retval = {};
		var max = getNumValuesFromNumDice(num_dice);

		Promise.try(function() {
		
			return(getRandomValue(max - 1));

		}).then(function(random) {

			var base6 = getBase6(random, num_dice);
			var dice = convertBase6ToDice(base6, num_dice);

			retval.value = random;
			retval.roll = dice;

			resolve(retval);

	});

}); // End of Promise()
} // End of rollDice()


