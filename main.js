/**
* Our main Javascript file.
*/

var Diceware = {};


/**
* Return true if we have a function that returns cryptographically random 
* values. False otherwise.
*/
Diceware.i_can_has_good_crypto = function() {

	if (window.crypto && window.crypto.getRandomValues) { 
		return(true);
	}

	return(false);

} // End of i_can_has_good_crypto()


/**
* Return a random integer between 1 max.
*/
Diceware.getRandomValue = function(max) {

	if (max <= 0){
		return(NaN);
	}

	if (Diceware.i_can_has_good_crypto()) {
		var a = new Uint32Array(1);
		window.crypto.getRandomValues(a);
		retval = (a[0] % max);

	} else {
		//
		// Fall back to something way less secure.  The user has already 
		// been warned.
		//
		retval = Math.floor(Math.random() * max);

	}


	return(retval);

} // End of getRandomValue()


/**
* Convert a number from base 10 into base 6.
*
* @param integer roll The random value.
* @param integer num_dice The number of dice we're returning.
*
* @return array An array of the base 6 numbers.
*/
Diceware.getBase6 = function(roll, num_dice) {

	var retval = [];

	//
	// Sanity check
	//
	var max_dice_roll = Math.pow(6, num_dice) - 1;
	if (roll > max_dice_roll) {
		throw("Value too large!");
	}

	if (roll < 0) {
		throw("Value cannot be negative!");
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
Diceware.convertBase6ToDice = function(roll, num_dice) {

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
Diceware.getNumValuesFromNumDice = function(num_dice) {

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
Diceware.rollDice = function(num_dice) {

	var retval = {};

	var max = Diceware.getNumValuesFromNumDice(num_dice);

	var random = Diceware.getRandomValue(max);

	var base6 = Diceware.getBase6(random, num_dice);

	var dice = Diceware.convertBase6ToDice(base6, num_dice);

	retval.value = random;
	retval.roll = dice;

	return(retval);

} // End of rollDice()


/**
* Look up a word from our wordlist.
*
* @param object wordlist Our hash table of dice rolls and their corresponding words.
* @param integer index 
*
* @return string The word from the dicelist
*/
Diceware.get_word = function(wordlist, index) {
	
	var retval = wordlist[index];

	if (retval) {
		retval = retval[0].toUpperCase() + retval.slice(1);

	} else {
		retval = "((Word not found in wordlist)) ";

	}

	return(retval);

}


/**
* This function displays each dice roll.
*
* @param array rows Array of rows of dice rolls that we had.
* @param object cb Our callback to fire when done
* @param integer in_fadein_duration How long before fading in a roll of dice
* @param integer in_fadeout_delay How long before fading out the diceroll
*
*/
Diceware.display_row = function(rows, cb, in_fadein_duration, in_fadeout_delay) {

	var fadein_duration = in_fadein_duration || 250;
	var fadeout_delay = in_fadeout_delay || 750;

	if (rows.length) {
		//
		// Grab a row, and hide each of the dice and the word in it.
		//
		var row = rows.shift();
		var html = row.hide().appendTo(".results");
		html.find(".dice_element").each(function(i, value) {
			jQuery(value).hide();
		});

		//
		// Now show the row, and loop through each element, fading in
		// the dice and the word in sequence.
		//
		html.show(fadein_duration, function() {

			jQuery(this).find(".dice_element").each(function(i, value) {
				var delay = i * 100;
				setTimeout(function() {
					jQuery(value).show();
				}, delay);

				});

			//
			// Decrease the delays with subsequent rolls so that users 
			// don't get impatent. 
			// (I know I did when rolling 8 dice!)
			//
			fadein_duration -= 25;
			fadeout_delay -= 50;

			//
			// Now fade out the entire row, and call ourselves again
			// so we can repeat with the next row.
			//
			jQuery(this).delay(fadeout_delay)
				.fadeOut(fadeout_delay, function() {
					Diceware.display_row(rows, cb, fadein_duration, fadeout_delay);
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
Diceware.display_results = function(cb) {

	jQuery(".results_words_key").hide().clone().appendTo(".results");
	jQuery(".results_words_value").hide().clone().appendTo(".results");
	jQuery(".results").append("<br clear=\"all\" />");

	jQuery(".results_phrase_key").hide().clone().appendTo(".results");
	jQuery(".results_phrase_value").hide().clone().appendTo(".results");
	jQuery(".results").append("<br clear=\"all\" />");

	jQuery(".results_num_possible_key").hide().clone().appendTo(".results");
	jQuery(".results_num_possible_value").hide().clone().appendTo(".results");

	jQuery(".results .results_words_key").fadeIn(500, function() {
		jQuery(".results .results_words_value").fadeIn(500, function() {
		jQuery(".results .results_phrase_key").fadeIn(400, function() {
		jQuery(".results .results_phrase_value").fadeIn(400, function() {
		jQuery(".results .results_num_possible_key").fadeIn(300, function() {
		jQuery(".results .results_num_possible_value").fadeIn(300, function() {
			if (cb) {
				cb();
			}
		});
		});
		});
		});
		});
		});

} // End of display_results()


/**
* Return the width of the browser window.
*/
Diceware.get_width = function() {
	return(jQuery(window).width());
}


/**
* Return true if we are running on a mobile screen.
*/
Diceware.is_mobile = function() {

	if (Diceware.get_width() <= 480) {
		return(true);
	}

	return(false);

} // End of is_mobile()


/**
* Our handler for what to do when the "Roll Dice" button is clicked".
* It generates the passphrase and updates the HTML.
*/
Diceware.rollDiceHandler = function(e) {

	//
	// Clear out more space when mobile
	//
	// In the future, I should just use a media query in CSS
	//
	var target_height = 300;
	if (Diceware.is_mobile()) {
		target_height = 400;
	}

	jQuery(".results").animate({height: target_height}, 400);

	//
	// If we're running on an iPhone or similar, scroll down so that we can 
	// see the dice rolls and passphrase.
	//
	if (Diceware.is_mobile()) {
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
	var num_passwords = Number(Math.pow(6, (5 * num_dice)));
	var passphrase = new Array();

	var rolls = new Array();
	for (var i=0; i<num_dice; i++) {

		var roll = {};
		//
		// Roll 5 dice for 7,776 words.
		//
		roll.dice = Diceware.rollDice(5);
		roll.word = Diceware.get_word(wordlist, roll.dice.value);
		rolls.push(roll);
		passphrase.push(roll.word);

	}

	//
	// Populate our results by cloning the hidden base rows which 
	// represent each die.
	//
	jQuery(".results_words_value").html(passphrase.join(" "));
	jQuery(".results_phrase_value").html(passphrase.join(""));
	jQuery(".results_num_possible_value").html(num_passwords.toLocaleString("en"));

	var rows = new Array();
	for (var key in rolls) {

		var roll = rolls[key];
		var row = jQuery("<div></div>");

		//
		// Clone and append specific dice to this row.
		//
		for (var key2 in roll.dice.roll) {
			var die = roll.dice.roll[key2];
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
	Diceware.display_row(rows, function() {

		//
		// And then display the results
		//
		Diceware.display_results(function() {

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

} // End of rollDiceHandler()


/**
* Our main function when being used via the UI.  We call this to set up our jQuery hooks.
*
* I should probably refactor this more in the future--this function came about
* when I changed the code from self-contained to contained in an external object
* in preparation fro Qunit testing...
*
*/
Diceware.go = function() {

	//
	// Handler to mark the clicked number of dice button as active.
	//
	jQuery(".dice_button").on("click", function(e) {
		jQuery(".dice_button").removeClass("active");
		jQuery(e.target).addClass("active");
	});


	jQuery("#roll_dice").on("click", Diceware.rollDiceHandler);


		//
		// If we're not on a mobile, bring in the GitHub ribbon.
		//
		if (!Diceware.is_mobile()) {
			jQuery("#github_ribbon").fadeIn(1000);
		}


		if (!Diceware.i_can_has_good_crypto()) {
			jQuery(".source .bad_crypto").clone().hide().fadeIn(800).appendTo(".message");
		}


		//
		// Load our wordlist.
		//
		jQuery.getScript("./wordlist/wordlist-5-dice.js").done(
			function(data) {

				//
				// If "debug" is set in the GET data, roll the dice on page load.
				// Speed up my development a bit. :-)
				//
				var debug = location.search.indexOf("debug");

				if (debug != -1) {

					//
					// Grab our number in the GET data, sanitize it, and click the appropriate button.
					//
					var offset = location.search.search("=");
					var num = location.search[offset + 1];
					if (num < 2) {
						num = 2;
					} else if (num > 8) {
						num = 8;
					}

					var id="#button-dice-" + num;
					jQuery(id).click();

					jQuery("#roll_dice").click();

				}

			}).fail(
				function(jqxhr, settings, exception) {
				console.log("Error loading Javascript:", jqxhr.status, settings, exception);

			});

} // End of go()


