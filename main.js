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
* Roll a die 5 times.
*
* @return array an Array of 5 dice rolls
*/
function roll_dice() {
	var retval = new Array();
	retval.push(die_roll());
	retval.push(die_roll());
	retval.push(die_roll());
	retval.push(die_roll());
	retval.push(die_roll());
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



/**
* This function displays each dice roll.
*
*
*/
function display_row(rows, cb) {

	if (rows.length) {
		//
		// Display a row, then call ourselves again then done.
		//
		var row = rows.shift();
		row.hide().appendTo(".results").fadeIn(500, function() {
			jQuery(".results").append("<br clear=\"all\" />");
			display_row(rows, cb);
			});

	} else {
		//
		// All done with displaying rows, fire our callback and get outta here.
		//
		cb();

	}

} // End of display_row()


/**
* Display the actual results.
*/
function display_results() {

	jQuery(".results_words_key").hide().clone().appendTo(".results");
	jQuery(".results_words_value").hide().clone().appendTo(".results");
	jQuery(".results").append("<br clear=\"all\" />");
	jQuery(".results_phrase_key").hide().clone().appendTo(".results");
	jQuery(".results_phrase_value").hide().clone().appendTo(".results");

	jQuery(".results_words_key").fadeIn(500, function() {
		jQuery(".results_words_value").fadeIn(500, function() {
		jQuery(".results_phrase_key").fadeIn(500, function() {
		jQuery(".results_phrase_value").fadeIn(500);
		});
		});
		});

} // End of display_results()


//
// Handler when the "Roll Dice" button is clicked.  It gets the 
// passphrase and updates the HTML with it.
//
jQuery("#roll_dice").on("click", function(e) {

	//
	// Remove any old results
	//
	jQuery(".results").empty();

	//
	// Make our dice rolls
	//
	var num_dice = jQuery(".dice_button.active").html();
	var passphrase = new Array();

	var rolls = new Array();
	for (var i=0; i<num_dice; i++) {
		var roll = roll_dice();
		rolls.push(roll);
		passphrase.push(get_word(wordlist, roll.join("")));
	}

	//
	// Populate our results
	//
	jQuery(".results_words_value").html(passphrase.join(" "));
	jQuery(".results_phrase_value").html(passphrase.join(""));

	var rows = new Array();
	for (key in rolls) {

		var roll = rolls[key];
		var row = jQuery("<div></div>");

		for (key2 in roll) {
			var die = roll[key2];
			var classname = ".source .dice" + die;
			jQuery(classname).clone().appendTo(row);
		}

		rows.push(row);

	}


	display_row(rows, display_results);

});


//
// Load our wordlist.
//
jQuery.getScript("./wordlist.js").done(
	function(data) {
// TEST
		jQuery("#roll_dice").click(); // Debugging

	}).fail(
	function(jqxhr, settings, exception) {
		console.log("Error loading Javascript:", jqxhr.status, settings, exception);

	});

})();


