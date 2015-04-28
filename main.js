/**
* Our main Javascript file.
*/
(function() {


/**
* Return true if we have a function that returns cryptographically random 
* values. False otherwise.
*/
function i_can_has_good_crypto() {

	if (window.crypto && window.crypto.getRandomValues) { 
		return(true);
	}

	return(false);

} // End of i_can_has_good_crypto()


/**
* Roll a die.
*
* @return integer A random number between 1 and 6, inclusive.
*/
function die_roll() {

	var retval;

	if (i_can_has_good_crypto()) {
		var a = new Uint32Array(1);
		window.crypto.getRandomValues(a);
		retval = (a[0] % 6) + 1;

	} else {
		//
		// Fall back to something way less secure.  The user has already 
		// been warned.
		//
		retval = Math.floor(Math.random() * 6) + 1;

	}

	return(retval);

}  // End of die_roll()


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
	var fadeout_delay = 500;

	if (rows.length) {
		//
		// Display a row, then call ourselves again then done.
		//
		var row = rows.shift();
		var tmp = row.hide().appendTo(".results")
			.fadeIn(duration, function() {

				jQuery(this).delay(fadeout_delay)
					.fadeOut(fadeout_delay, function() {
						display_row(rows, cb);
				});

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
*
* @param cb object Optional callback to fire when done
*/
function display_results(cb) {

	jQuery(".results_words_key").hide().clone().appendTo(".results");
	jQuery(".results_words_value").hide().clone().appendTo(".results");
	jQuery(".results").append("<br clear=\"all\" />");
	jQuery(".results_phrase_key").hide().clone().appendTo(".results");
	jQuery(".results_phrase_value").hide().clone().appendTo(".results");

	jQuery(".results .results_words_key").fadeIn(500, function() {
		jQuery(".results .results_words_value").fadeIn(500, function() {
		jQuery(".results .results_phrase_key").fadeIn(500, function() {
		jQuery(".results .results_phrase_value").fadeIn(500, function() {
			if (cb) {
				cb();
			}
		});
		});
		});
		});

} // End of display_results()


/**
* Return the width of the browser window.
*/
function get_width() {
	return(jQuery(window).width());
}


/**
* Return true if we are running on a mobile screen.
*/
function is_mobile() {

	if (get_width() <= 480) {
		return(true);
	}

	return(false);

} // End of is_mobile()


//
// Handler when the "Roll Dice" button is clicked.  It gets the 
// passphrase and updates the HTML with it.
//
jQuery("#roll_dice").on("click", function(e) {

	var target_height = 200;
	if (is_mobile()) {
		target_height = 300;
	}

	jQuery(".results").animate({height: target_height}, 400);

	//
	// If we're running on an iPhone or similar, scroll down so that we can 
	// see the dice rolls and passphrase.
	//
	if (is_mobile()) {
		var aTag = $("a[name='roll_dice_button']");
		$("html,body").animate({scrollTop: aTag.offset().top}, "slow");
	}

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

		//
		// And clear to the next line
		//
		row.append("<br clear=\"all\" />");
	
		rows.push(row);

	}

	//
	// Now display those rows.
	//
	display_row(rows, function() {
		display_results(function() {

		//
		// Set the height of this back to auto so we don't have unused space.
		// I'm amazed that we don't see a "flash" of the results div 
		// temporarily shrinking, but this seems to work as per what I saw 
		// at http://stackoverflow.com/questions/5003220/javascript-jquery-animate-to-auto-height
		//
		// Well then.
		//
		var height = jQuery(".results").height();
		jQuery(".results").css("height", "auto");
		var new_height = jQuery(".results").height();
		jQuery(".results").height(height);
		jQuery(".results").animate({height: new_height}, 400);

		});
		});

});


//
// If we're not on a mobile, bring in the GitHub ribbon.
//
if (!is_mobile()) {
	jQuery("#github_ribbon").fadeIn(1000);
}

if (!i_can_has_good_crypto()) {
	jQuery(".source .bad_crypto").clone().hide().fadeIn(800).appendTo(".message");
}

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


