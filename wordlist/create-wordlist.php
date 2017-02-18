#!/usr/bin/env php
<?php
/**
* This script creates the Javascript code with the wordlist based on 
* the 1/3 most used words in English, found at http://norvig.com/ngrams/
* 
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
* Create our Javascript, but as an array
*
* @param array $words Our array of words
*
* @return string Javascript which defines an array of those words
*/
function getJsArray($words) {

	$retval = ""
		. "//\n"
		. "// Our wordlist.\n"
		. "//\n"
		. "// Originally obtained from http://norvig.com/ngrams/\n"
		. "//\n"
		. "var wordlist = [\n"
		;

	$beenhere = false;
	foreach ($words as $key => $value) {

		if ($beenhere) {
			$retval .= ",\n";
		}

		$retval .= "\t\"${value}\"";

		$beenhere = true;

	}

	$retval .= "\n"
		. "];\n"
		. "\n"
		;
	
	return($retval);

} // End of getJsArray()


/**
* Our main entry point.
*/
function main() {

	//
	// Read our file
	//
	$filename = "count_1w.txt";
	$words = readWordListPeterNorvig($filename);
	//print_r($words); // Debugging

	//
	// Match words to dicerolls
	//
	//$rolls = getDiceRolls($words);

	//
	// Get our Javascript
	//
	$js = getJsArray($words);

	print $js;

} // End of main()


main();


