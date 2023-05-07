

let Promise = require("bluebird");
let randomNumber = require("random-number-csprng");


module.exports = function(arg) {

    //
    // Export our functions.
    //
    return({
        iCanHasGoodCrypto: iCanHasGoodCrypto,  
        convertBigNumberToString: convertBigNumberToString,
        getRandomValue: getRandomValue,
    });

}


/**
* Return true if we have a function that returns cryptographically random 
* values. False otherwise.
*/
function iCanHasGoodCrypto() {

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
function getRandomValue(max) {
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
* Convert a big number to a string for readability.
*/
function convertBigNumberToString(bignum) {

    //
    // Default to what we passed in, in case we don't get a match.
    //
    let retval = bignum

    let bigstring = Number(bignum).toLocaleString("fullwide", {useGrouping: false});

    let len = bigstring.length;

    if (len >= 31) {
        let remainder = bigstring.slice(0, -30);
        retval = `${remainder} nonillion`

    } else if (len >= 28) {
        let remainder = bigstring.slice(0, -27);
        retval = `${remainder} octillion`

    } else if (len >= 25) {
        let remainder = bigstring.slice(0, -24);
        retval = `${remainder} septillion`

    } else if (len >= 22) {
        let remainder = bigstring.slice(0, -21);
        retval = `${remainder} sextillion`

    } else if (len >= 19) {
        let remainder = bigstring.slice(0, -18);
        retval = `${remainder} quintillion`

    } else if (len >= 16) {
        let remainder = bigstring.slice(0, -15);
        retval = `${remainder} quadrillion`

    } else if (len >= 13) {
        let remainder = bigstring.slice(0, -12);
        retval = `${remainder} trillion`

    } else if (len >= 10) {
        let remainder = bigstring.slice(0, -9);
        retval = `${remainder} billion`

    } else if (len >= 7) {
        let remainder = bigstring.slice(0, -6);
        retval = `${remainder} million`

    }

    return(retval);

} // End of convertBigNumberToString()


