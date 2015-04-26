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


//
// Handler to mark the clicked number of dice button as active.
//
jQuery(".dice_button").on("click", function(e) {
	jQuery(".dice_button").removeClass("active");
	jQuery(e.target).addClass("active");
});


//
// Handler when the "Roll Dice" button is clicked.  It gets the 
// passphrase and updates the HTML with it.
//
jQuery("#roll_dice").on("click", function(e) {

	jQuery(".results_words_key").hide();
	jQuery(".results_words_value").hide();
	jQuery(".results_phrase_key").hide();
	jQuery(".results_phrase_value").hide();

	var num_dice = jQuery(".dice_button.active").html();
	var passphrase = new Array();

	for (var i=0; i<num_dice; i++) {
		var roll = roll_dice();
		passphrase.push(get_word(wordlist, roll));
	}

	jQuery(".results_words_value").html(passphrase.join(" "));
	jQuery(".results_phrase_value").html(passphrase.join(""));

	jQuery(".results_words_key").fadeIn(500, function() {
		jQuery(".results_words_value").fadeIn(500, function() {
		jQuery(".results_phrase_key").fadeIn(500, function() {
		jQuery(".results_phrase_value").fadeIn(500);
		});
		});
		});

});


//
// Load our wordlist.
//
jQuery.getScript("./wordlist.js").done(
	function(data) {
		//jQuery("#roll_dice").click(); // Debugging

	}).fail(
	function(jqxhr, settings, exception) {
		console.log("Error loading Javascript:", jqxhr.status, settings, exception);

	});

})();


