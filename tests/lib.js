
/**
* Return an array with max values, where each value is the number of times
* the remainer was that of the index.  This is used to show bias in a 
* particular dividend.
*
* Based on code at https://github.com/dmuth/diceware/issues/7
*/
function demonstrateBias(max) {

	var map = new Array(max);

	for (var i = 0; i < max; i++) {
		map[i] = 0;
	}
  
	//
	// Go through all possible values (note that any power of 2 
	// should work, instead of 256...) and increment map by one for each 
	// remainder we get across that set.
	//
	for (var i = 0; i < 256; i++) {
		map[i % max]++;
	}

	//
	// All of the values in this should be equal.  If not, there's bias!
	//
	return map;

} // End of demonstrateBias()


//console.log(demonstrateBias(4));
//console.log(demonstrateBias(5));
//console.log(demonstrateBias(6));
//console.log(demonstrateBias(8));

