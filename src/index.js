/**
* Our main Javascript file.
*/

let Promise = require("bluebird");

let lib = require("./lib.js")();


//
// I'm not a huge fan of globals, but the alternative was passing this variable into
// nearly every module, which gave me headaches trying to keep track of the dependency.
// I am storing things in modules (such as the wordlist) where I can...
//
window.Diceware = {};

// Functions that relate to displaying dice
display = require("./display.js")()

// Wordlist handling
wordlist = require("./wordlist.js")()

// Misc utilities
util = require("./util.js")();


//
// How many dice per roll?
//
window.Diceware.num_dice_per_roll = 5;


/**
* Set the handlers 
*/
function set_handlers() {

	//
	// Handler to mark the clicked number of dice button as active.
	//
	jQuery(".dice_button").on("click", function(e) {
		jQuery(".dice_button").removeClass("active");
		jQuery(e.target).addClass("active");
	});

	jQuery("#roll_dice").on("click", display.rollDiceHandler);

  jQuery(".results_copy_button").on("click", function() {
console.log("TEST :-)");

/*
    const tmp = $('<textarea>').css({
        position: 'fixed', // Keep it in place to prevent scrolling issues
        top: 0,
        left: 0,
        width: '1px',
        height: '1px',
        opacity: 0, // Make it invisible
        pointerEvents: 'none' // Ensure it doesn't interfere with user interaction
      });
*/
    let tmp = $("#results_copy_text");
console.log(tmp);
    //$("body").append(tmp);

    // Get the text from the div and set it as the value of the textarea
    //tempTextarea.val($('#textToCopy').text()).select();
// TEST/TODO - Select text from element results_phrase_value
    tmp.val("TEST VAL").select();

    // Copy the text to the clipboard
    try {
      document.execCommand('copy');
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    // Remove the temporary textarea
    //tmp.remove();
/*
*/
    });

} // End of set_handlers()


/**
* Run our pre-flight checks.
*/
function run_preflight_checks() {

	//
	// If we're not on a mobile, bring in the GitHub ribbon.
	//
	if (!util.is_mobile()) {
		jQuery("#github_ribbon").fadeIn(1000);
	}

	if (!lib.iCanHasGoodCrypto()) {
		jQuery(".source .bad_crypto").clone().hide().fadeIn(800).appendTo(".message");
	}

} // End of run_preflight_checks()


/**
* Our main function when being used via the UI.  We call this to set up our jQuery hooks.
*
*/
function go() {

	console.log("Thanks for checking out my code! You can find the Git repo at https://github.com/dmuth/diceware, my blog at https://www.dmuth.org/, or you can bug me on Twitter at https://twitter.com/dmuth");

	console.log("Version: $Id$");

    //
    // Set our handlers
    //
    set_handlers()

    //
    // Run our pre-flight checks
    //
    run_preflight_checks()

    //
    // Get the filename of the wordlist that we're loading.
    //
    let file = wordlist.get_filename()
	console.log(`Looks like we're loading ${file["filename"]}!`);

    //
    // Load the wordlist.
    //
	let debug = location.search.indexOf("debug");
	window.Diceware.get_data = util.extract_get_data(location.search);
	console.log("GET Data: " + JSON.stringify(window.Diceware.get_data)); // Debugging

    wordlist.load(file, window.Diceware.get_data, debug)

} // End of go()


//
// Run go() automatically, as that is the webpack way.
//
go();


