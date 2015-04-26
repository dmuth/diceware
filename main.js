/**
* Our main Javascript file.
*/
(function() {

/**
* Roll a die.
*
* @return integer A random number between 1 and 6, inclusive.
*/
function die_roll() {
	return(Math.floor(Math.random() * 6) + 1);
} 


/**
* Roll a die n times.
*
* @return integer a 5-digit integer representing 5 dice rolls.
*/
function roll_dice() {
	var retval = 
		String(die_roll()) + String(die_roll())
		+ String(die_roll()) + String(die_roll())
		+ String(die_roll())
		;
	retval = parseInt(retval);
	return(retval);
}


/**
* Look up a word from our wordlist.
*
* @param object wordlist Our hash table of dice rolls and their corresponding words.
* @param integer index 
*
* @return string The word from the dicelist
*/
function get_word(wordlist, index) {
	var retval = wordlist[index];
	return(retval);
}


jQuery.getScript("./wordlist.js").done(
	function(data) {

	}).fail(
	function(jqxhr, settings, exception) {
		console.log("Error loading Javascript:", jqxhr.status, settings, exception);

	});

})();


