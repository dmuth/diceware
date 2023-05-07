

let Promise = require("bluebird");

let lib = require("./lib.js")();

module.exports = function(arg) {

    //
    // Export our functions.
    //
    return({
        rollDice: rollDice,
    });

}


/**
* Convert a number from base 10 into base 6.
*
* @param integer roll The random value.
* @param integer num_dice The number of dice we're returning.
*
* @return array An array of the base 6 numbers.
*/
function getBase6 (roll, num_dice) {

	let retval = [];

	//
	// Sanity check
	//
	let max_dice_roll = Math.pow(6, num_dice) - 1;
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
	let num_dice_left = num_dice - 1;
	let dice_value_left = roll;

	for (let i = num_dice_left; i >= 0; i--) {

		let die_value = Math.pow(6, i);
		let value = Math.floor( dice_value_left / die_value);
		let left = dice_value_left % die_value;

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
function convertBase6ToDice (roll, num_dice) {

	let retval = [];

	if (roll.length != num_dice) {
		throw("Mismatch between size of roll (" + roll.length + ") and number of dice (" + num_dice + ")");
	}

	for (let k in roll) {
		let num = roll[k];

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
function getNumValuesFromNumDice (num_dice) {

	let retval;

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
function rollDice(num_dice) {
	return new Promise(function(resolve, reject) {

		let retval = {};
		let max = getNumValuesFromNumDice(num_dice);

		Promise.try(function() {
		
			return(lib.getRandomValue(max - 1));

		}).then(function(random) {

			let base6 = getBase6(random, num_dice);
			let dice = convertBase6ToDice(base6, num_dice);

			retval.value = random;
			retval.roll = dice;

			resolve(retval);

	});

    }); // End of Promise()

} // End of rollDice()



