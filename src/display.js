

let lib = require("./lib.js")();

// Functions that relate to rolling dice
dice = require("./dice.js")();

wordlist = require("./wordlist.js")();

// Misc utilities
util = require("./util.js")();

let Promise = require("bluebird");


module.exports = function (arg) {

    //
    // Export our functions.
    //
    return ({
        rollDiceHandler: rollDiceHandler,
    });

}

/**
* Dispaly all of our rows (dice rolls) and the results.
*/
function _rows(rows) {

    //
    // Now display those rows.
    //
    _row(rows, function () {

        //
        // And then display the results
        //
        results(function () {

            //
            // Set the height of this back to auto so we don't have unused space.
            // I'm amazed that we don't see a "flash" of the results div 
            // temporarily shrinking, but this seems to work as per what I saw 
            // at http://stackoverflow.com/questions/5003220/javascript-jquery-animate-to-auto-height
            //
            // Well then.
            //
            let height = jQuery(".results").height();
            jQuery(".results").css("height", "auto");

            let new_height = jQuery(".results").height();
            jQuery(".results").height(height);
            jQuery(".results").animate({ height: new_height }, 400);

            //
            // All done with our results, re-enable the button!
            //
            jQuery("#roll_dice").prop("disabled", false);

        });

    });

} // End of _rows()


/**
* This function displays each dice roll.
*
* @param array rows Array of rows of dice rolls that we had.
* @param object cb Our callback to fire when done
* @param integer in_fadein_duration How long before fading in a roll of dice
* @param integer in_fadeout_delay How long before fading out the diceroll
*
*/
function _row(rows, cb, in_fadein_duration, in_fadeout_delay) {

    let fadein_duration = in_fadein_duration || 250;
    let fadeout_delay = in_fadeout_delay || 400;

    if (rows.length) {
        //
        // Grab a row, and hide each of the dice and the word in it.
        //
        let row = rows.shift();
        let html = row.hide().appendTo(".results");
        html.find(".dice_element").each(function (i, value) {
            jQuery(value).hide();
        });

        //
        // Now show the row, and loop through each element, fading in
        // the dice and the word in sequence.
        //
        html.show(fadein_duration, function () {

            jQuery(this).find(".dice_element").each(function (i, value) {
                let delay = i * 100;
                setTimeout(function () {
                    jQuery(value).show();
                }, delay);

            });

            //
            // Decrease the delays with subsequent rolls so that users 
            // don't get impatent. 
            // (I know I did when rolling 8 dice!)
            //
            fadein_duration -= 25;
            //fadeout_delay -= 50;

            //
            // Now fade out the entire row, and call ourselves again
            // so we can repeat with the next row.
            //
            jQuery(this).delay(fadeout_delay)
                .fadeOut(fadeout_delay, function () {
                    _row(rows, cb, fadein_duration, fadeout_delay);
                });

        });

    } else {
        //
        // All done with displaying rows, fire our callback and get outta here.
        //
        cb();

    }

} // End of row()


/**
* Display the actual results.
*
* @param cb object Optional callback to fire when done
*/
function results(cb) {

    jQuery(".results_words_key").hide().clone().appendTo(".results");
    jQuery(".results_words_value").hide().clone().appendTo(".results");
    jQuery(".results").append("<br clear=\"all\" />");

    jQuery(".results_phrase_key").hide().clone().appendTo(".results");
    jQuery(".results_phrase_value").hide().clone().appendTo(".results");
    jQuery(".results").append("<br clear=\"all\" />");

    jQuery(".results_num_possible_key").hide().clone().appendTo(".results");
    jQuery(".results_num_possible_value").hide().clone().appendTo(".results");

    jQuery(".results .results_words_key").fadeIn(500).promise().then(function () {
        return (jQuery(".results .results_words_value").fadeIn(500).promise())
    }).then(function () {
        return (jQuery(".results .results_phrase_key").fadeIn(400).promise());
    }).then(function () {
        return (jQuery(".results .results_phrase_value").fadeIn(400).promise());
    }).then(function () {
        return (jQuery(".results .results_num_possible_key").fadeIn(300).promise());
    }).then(function () {
        return (jQuery(".results .results_num_possible_value").fadeIn(300).promise());
    }).then(function () {
        if (cb) {
            cb();
        }
    });

} // End of results()


/**
* Do some preliminary work, such as clearing out results and scrolling.
*/
function rollDiceHandlerPre() {

    //
    // Clear out more space when mobile
    //
    // In the future, I should just use a media query in CSS
    //
    let target_height = 300;
    if (util.is_mobile()) {
        target_height = 400;
    }

    jQuery(".results").animate({ height: target_height }, 400);

    //
    // If we're running on an iPhone or similar, scroll down so that we can 
    // see the dice rolls and passphrase.
    //
    if (util.is_mobile()) {
        let aTag = $("a[name='roll_dice_button']");
        $("html,body").animate({ scrollTop: aTag.offset().top }, "slow");
    }

    //
    // Remove any old results
    //
    jQuery(".results").empty();

} // End of rollDiceHandlerPre()


/**
* Our handler for what to do when the "Roll Dice" button is clicked".
* It generates the passphrase and updates the HTML.
*/
function rollDiceHandler(e) {

    //
    // Disable our button while generating results
    //
    jQuery("#roll_dice").prop("disabled", true);

    rollDiceHandlerPre();

    //
    // Make our dice rolls
    //
    let num_dice = jQuery(".dice_button.active").html();
    console.log(`Rolling ${num_dice} dice...`);
    let num_passwords = Number(Math.pow(6, (window.Diceware.num_dice_per_roll * num_dice)));
    let passphrase = new Array();
    let rolls = new Array();

    //
    // Create an array of empty items, since this is the only way I can 
    // figure out to do a loop in Bluebird at this time. Ugh.
    //
    let items = [];
    for (i = 0; i < num_dice; i++) { items.push(null); }

    Promise.map(items, function (element) {
        //
        // Do our dice rolls all at once.
        //
        return (dice.rollDice(window.Diceware.num_dice_per_roll));

    }).then(function (data) {
        //
        // Now that we have the results, get the word for each roll, 
        // save the roll, and push the word onto the passphrase.
        //
        let count = 0;

        data.forEach(function (row) {
            let roll = {};
            roll.dice = row;
            // console.log("Debug Dice Roll", JSON.stringify(roll.dice)); // Debugging
            if (count === (Number(num_dice) - 1)) {
                roll.word = String(Number(roll.dice.value) % 10)
                rolls.push(roll);
                passphrase.push(roll.word);
            } else {
                roll.word = util.get_word(wordlist.get, roll.dice.value);
                rolls.push(roll);
                passphrase.push(roll.word);
                count++;
                console.log(`count: ${count}`);
            }
        });

        //
        // Store the number of dice rolled in a data attribute for 
        // inspection by Cypress or another test.
        //
        let results_num_dice = jQuery("#results-num-dice");
        results_num_dice.text(num_dice);

        rollDiceHandlerPost(rolls, passphrase, num_passwords);

    });

} // End of rollDiceHandler()


/**
* Our post work, of displaying the results of our dice rolls.
*/
function rollDiceHandlerPost(rolls, passphrase, num_passwords) {

    //
    // Populate our results by cloning the hidden base rows which 
    // represent each die.
    //
    jQuery(".results_words_value").html(passphrase.join(" "));
    //
    // Separate words in the phrase by "Word Break Opportunity" 
    // tag so they will wrap properly on a narrow/mobile screen.
    //
    jQuery(".results_phrase_value").html(passphrase.join("<wbr>"));
    //
    // Convert the number of passwords to something based on the 
    // locale and then add in <wbr> tags so they too will wrap.
    //
    num_passwords = lib.convertBigNumberToString(num_passwords);
    num_passwords_html = num_passwords.toLocaleString("fullwide");
    num_passwords_html = num_passwords_html.replace(/,/g, ",<wbr>");

    jQuery(".results_num_possible_value").html(num_passwords_html);

    let rows = new Array();
    for (let key in rolls) {

        let roll = rolls[key];
        let row = jQuery("<div></div>");

        //
        // Clone and append specific dice to this row.
        //
        for (let key2 in roll.dice.roll) {
            let die = roll.dice.roll[key2];
            let classname = ".source .dice" + die;
            let tmp = jQuery(classname).clone().appendTo(row);
        }

        //
        // Now append the word
        //
        let dice_word = jQuery(".dice_word").clone();
        dice_word.html("\"" + roll.word + "\"");
        row.append(dice_word);

        //
        // And clear to the next line
        //
        row.append("<br clear=\"all\" />");

        if ("skip_animation" in window.Diceware.get_data) {
            console.log("Debug value 'skip_animation' set, not showing the dice!");
        } else {
            rows.push(row);
        }

    }

    _rows(rows);

} // End of rollDiceHandlerPost()



