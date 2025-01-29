let Promise = require("bluebird");

module.exports = function(arg) {

    //
    // Export our functions.
    //
    return({
        is_mobile: is_mobile,
        get_word: get_word,
        extract_get_data: extract_get_data,
        copyToClipboard: copyToClipboard,
    });

}


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


/**
* Look up a word from our wordlist.
*
* @param callback A callback which returns our currently loaded wordlist
* @param integer index 
*
* @return string The word from the dicelist
*/
function get_word(cb_wordlist, index) {
	
	let retval = cb_wordlist()[index];

	if (retval) {
		retval = retval[0].toUpperCase() + retval.slice(1);

	} else {
		retval = "((Word not found in wordlist)) ";

	}

	return(retval);

} // End of get_word()


/**
* Turn our GET method data into an associative array.
*/
function extract_get_data(get_data) {

	let retval = {};

	if (!location.search) {
		return(retval);
	}	

	let get = get_data.substring(1);
	let pairs = get.split("&");

	for (let k in pairs) {
		let row = pairs[k];
		let pair = row.split("=");
		let key = pair[0];
		let value = pair[1];
		retval[key] = value;

	}

	return(retval);

} // End of extractGetData()

/**
* Copy text to clipboard and provide visual feedback
*
* @param {string} text The text to copy
* @return {Promise} Resolves when copying is complete
*/
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    const $copyBtn = $('.copy-button');
    const originalText = $copyBtn.html();
    
    $copyBtn
      .html('<span class="glyphicon glyphicon-ok"></span> Copied!')
      .fadeIn();
    
    setTimeout(() => {
      $copyBtn.html(originalText);
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
}



