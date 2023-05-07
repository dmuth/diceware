

let Promise = require("bluebird");

//
// Our loaded wordlist.
// This is an array of one word per line.
//
let _wordlist;

module.exports = function(arg) {

    //
    // Export our functions.
    //
    return({
        get_filename: get_filename,
        load: load,
        get: get,
    });

}


/**
* Figure out what filename we're loading.
*/
get_filename = function() {

    let retval = {};

    //
    // For now, we're using the 5 dice file from the EFF.
    // I expect to add support for multiple dice files in the future.
    //
    file = "wordlist-eff-5-dice.txt";

	retval = {
        file: "EFF Wordlist",
        filename: `./assets/wordlist/${file}`,
        }

    return(retval);

} // End of get_filename()


/**
* Load our wordlist with an XHR request.
*/
load = function(file, get_data, debug) {

    jQuery("#roll_dice_text").html(`Loading wordlist '${file["file"]}'...`);
    jQuery("#roll_dice").prop("disabled", true);

    fetch(file["filename"]).then(function(response) {

        if (!response.ok) {
            throw Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return(response.text());

    }).then(function(data) {
        _wordlist = data.split(/\r?\n/); 

        console.log(`File ${file["filename"]} loaded!`);

        jQuery("#roll_dice_text").html("Roll Dice!");
        jQuery("#roll_dice").prop("disabled", false);

		//
		// If "debug" is set in the GET data, roll the dice on page load.
		// Speed up my development a bit. :-)
		//
		if (get_data["debug"] && get_data["debug"] > 0) {

			let num = get_data["debug"];
			if (num < 2) {
				num = 2;
			} else if (num > 8) {
				num = 8;
			}

			let id="#button-dice-" + num;
			jQuery(id).click();

			console.log("Debug mode enabled, auto-rolling " + num + " times!");
			jQuery("#roll_dice").click();

		}

    }).catch(function(error) {
        console.log(`Error loading file ${file["filename"]}: `, error);

    });

} // End of load()


/**
* Return our wordlist.
*/
function get() {
    return(_wordlist);
}

