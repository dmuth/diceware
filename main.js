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
* @param array rows Array of rows of dice rolls that we had.
* @param object cb Our callback to fire when done
*
*/
function display_row(rows, cb) {

	var duration = 250;
	var fadein_delay = 500;

	if (rows.length) {
		//
		// Display a row, then call ourselves again then done.
		//
		var row = rows.shift();
		var tmp = row.hide().appendTo(".results")
			.delay(fadein_delay)
			.fadeIn(duration, function() {
				jQuery(".results").append("<br clear=\"all\" />");
				display_row(rows, cb);
			})
			.delay(1000).fadeOut(duration);

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

		var roll = {};
		roll.dice = roll_dice();
		roll.word = get_word(wordlist, roll.dice.join(""));
		rolls.push(roll);
		passphrase.push(roll.word);

	}

	//
	// Populate our results by cloning the hidden base rows which 
	// represent each die.
	//
	jQuery(".results_words_value").html(passphrase.join(" "));
	jQuery(".results_phrase_value").html(passphrase.join(""));

	var rows = new Array();
	for (key in rolls) {

		var roll = rolls[key];
		var row = jQuery("<div></div>");

		//
		// Clone and append specific dice to this row.
		//
		for (key2 in roll.dice) {
			var die = roll.dice[key2];
			var classname = ".source .dice" + die;
			var tmp = jQuery(classname).clone().appendTo(row);
		}

		//
		// Now append the word
		//
		var dice_word = jQuery(".dice_word").clone();
		dice_word.html("\"" + roll.word + "\"");
		row.append(dice_word);
	
		rows.push(row);

	}

	//
	// Now display those rows.
	//
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


