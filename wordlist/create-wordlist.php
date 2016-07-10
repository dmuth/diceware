#!/usr/bin/env php
<?php
/**
* This script creates the Javascript code with the wordlist based on 
* the 10,000 most used English words found at https://github.com/first20hours/google-10000-english
* 
* It filters out anything less than 4 characters so we get decent words.
*/

if (php_sapi_name() != "cli") {

	print "This script can only be run from the command line!\n";
	exit(1);

}


/**
* Read in our wordlist and return an array with all words that 
* passed validation.
*
* @param string $filename The filename
*
* @return array An array of words
*
*/
function readWordList($filename) {

	$retval = array();

	$fp = @fopen($filename, "r");
	if (!$fp) {
		throw new Exception("Could not open '$filename' for reading");
	}

	while ($line = fgets($fp)) {

		$word = rtrim($line);
		$len = strlen($word);

		//
		// Removing anything with less than 5 characters leaves us with 7781 words,
		// just slightly more than the 7776 (6^5) words we need.  What a happen coincidence!
		//
		if ($len < 5) {
			continue;
		}

		$retval[] = $word;

	}


	fclose($fp);

	return($retval);

} // End of readWordList()


/**
* Our main entry point.
*/
function main() {

	$filename = "google-10000-english.txt";
	$words = readWordList($filename);

} // End of main()


main();


