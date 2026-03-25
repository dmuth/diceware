

module.exports = function(arg) {

    //
    // Export our functions.
    //
    return({
        convertBigNumberToString,
        getRandomValue,
    });

}


/**
* Return a random integer between 0 and max, inclusive.
*/
function getRandomValue(max) {

    if (!Number.isInteger(max) || max < 0) {
        throw new Error("max must be a non-negative integer");
    }

    const cryptoObj = globalThis.crypto;
    if (!cryptoObj?.getRandomValues) {
        throw new Error("Secure random number generation is unavailable");
    }

    const range = max + 1;
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - ((maxUint32 + 1) % range);
    const array = new Uint32Array(1);

    do {
        cryptoObj.getRandomValues(array);
    } while (array[0] > limit);

    return array[0] % range;

}


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


