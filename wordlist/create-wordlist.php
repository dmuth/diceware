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
* Read in our wordlist from Google and return an array with all words that 
* passed validation.
*
* @param string $filename The filename
*
* @return array An array of words
*
*/
function readWordListGoogle($filename) {

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

	//
	// Put the words in alphabetical order for my own sanity.
	//
	sort($retval);

	fclose($fp);

	return($retval);

} // End of readWordListGoogle()


/**
* Read in our wordlist from Google and return an array with all words that 
* passed validation.
*
* @param string $filename The filename
*
* @return array An array of words
*
*/
function readWordListPeterNorvig($filename) {

	$retval = array();

	$fp = @fopen($filename, "r");
	if (!$fp) {
		throw new Exception("Could not open '$filename' for reading");
	}

	$count = 0;
	while ($line = fgets($fp)) {

		$line = rtrim($line);
		list($word, $freq) = explode("\t", $line);
		$len = strlen($word);

		//
		// Keep all words between 4 and 7 characters
		//
		if ($len < 4 || $len > 7) {
			continue;
		}

		$retval[] = $word;

		$count++;

		if ($count > 7776) {
			break;
		}

	}

	//
	// Put the words in alphabetical order for my own sanity.
	//
	sort($retval);

	fclose($fp);

	return($retval);

} // End of readWordListPeterNorvig()


/**
* Turn our list of words into an array which contains the dice rolls to get 
* those rolls as a key.
*
* @param array $words Our array of words
*
* @return array An array where the key is the diceroll and the value is the word.
*/
function getDiceRolls($words) {

	$retval = array();

	for ($i = 1; $i <= 6; $i++) {
		for ($j = 1; $j <= 6; $j++) {
			for ($k = 1; $k <= 6; $k++) {
				for ($l = 1; $l <= 6; $l++) {
					for ($m = 1; $m <= 6; $m++) {

						$key = "${i}${j}${k}${l}${m}";
						$retval[$key] = next($words);

					}
				}
			}
		}
	}

	return($retval);

} // End of getDiceRolls()


/**
* Create our Javascript
*
* @param array $rolls Our array of rolls and the word that the roll has
*
* @return string Javascript which defines an array of those rolls
*/
function getJs($rolls) {

	$retval = ""
		. "//\n"
		. "// Our wordlist.\n"
		. "//\n"
		. "// Originally obtained from https://github.com/first20hours/google-10000-english\n"
		. "//\n"
		. "var wordlist = {\n"
		;

	$beenhere = false;

	foreach ($rolls as $key => $value) {

		if ($beenhere) {
			$retval .= ",\n";
		}

		$retval .= "\t${key}:\"${value}\"";

		$beenhere = true;

	}

	$retval .= "\n"
		. "};\n"
		. "\n"
		;
	
	return($retval);

} // End of getJs()


/**
* Our main entry point.
*/
function main() {

	//
	// Read our file
	//
	//$filename = "google-10000-english.txt";
	//$words = readWordListGoogle($filename);
	$filename = "count_1w.txt";
	$words = readWordListPeterNorvig($filename);

	//
	// Match words to dicerolls
	//
	$rolls = getDiceRolls($words);

	//
	// Get our Javascript
	//
	$js = getJs($rolls);

	print $js;

} // End of main()


main();


