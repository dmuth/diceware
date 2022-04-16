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
* Print out syntax and exit.
*/
function printSyntax($progname) {

	print "Syntax: $progname [ --dice n | --eff ]\n\n"
		. "\t--dice  Number of dice to generate a wordlist for.  Must be between 5 and 7 inclusive. Defaults to 5.\n"
		. "\t--eff Generate wordlist against the EFF's list, found at https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases"
		. "\n"
		;

	exit(1);

} // End of printSyntax()


/**
* Parse our arguments.
*
* @param array $argv Our command line arguments
*
* @return array An associative array of whatever we parsed out.
*/
function parseArgs($argv) {

	$retval = array();

	$progname = array_shift($argv);

	while ($value = array_shift($argv)) {

		$value_next = "";
		if (isset($argv[0])) {
			$value_next = $argv[0];
		}

		if ($value == "-h" || $value == "--help") {
			printSyntax($progname);
		}

		if ($value == "--dice") {
			$retval["dice"] = $value_next;
		}

		if ($value == "--eff") {
			$retval["eff"] = true;
		}

	}

	if (isset($retval["dice"])) {
		if ($retval["dice"] < 5 || $retval["dice"] > 7) {
			printSyntax($progname);
		}

	} else if (!isset($retval["eff"])) {
		printSyntax($progname);

	}

	return($retval);

} // End of parseArgs()


/**
* Read in our wordlist from Google and return an array with all words that 
* passed validation.
*
* @param string $filename The filename
*
* @param integer $dice How many dice rolls to make?  This number will
*	be between 5 and 8, inclusive.
*
* @return array An array of words
*
*/
function readWordListPeterNorvig($filename, $dice) {

	$retval = array();

	$fp = @fopen($filename, "r");
	if (!$fp) {
		throw new Exception("Could not open '$filename' for reading");
	}

	$count = 0;
	$max_count = array(
		5 => 7776,
		6 => 46656,
		7 => 279936,
		//8 => 1679616, // Can't do this with only 1/3rd million words ATM.
		);

	//
	// We will tweak acceptable word length based on the number of 
	// dice we are rolling so we get enough words.
	//
	$word_lengths = array(
		5 => array("min" => 4, "max" => 7),
		6 => array("min" => 5, "max" => 6),
		7 => array("min" => 4, "max" => 11),
		);

	while ($line = fgets($fp)) {

		$line = rtrim($line);
		list($word, $freq) = explode("\t", $line);
		$len = strlen($word);

		if ($len < $word_lengths[$dice]["min"] || $len > $word_lengths[$dice]["max"]) {
			continue;
		}

		$retval[] = $word;

		$count++;

		if ($count > $max_count[$dice]) {
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
* Read in the EFF's wordlist and return an array with all the words.
*
* @param string $filename The filename
*
* @return array An array of words
*
*/
function readWordListEff($filename) {

	$retval = array();

	$fp = @fopen($filename, "r");
	if (!$fp) {
		throw new Exception("Could not open '$filename' for reading");
	}

	while ($line = fgets($fp)) {

		$line = rtrim($line);
		list($roll, $word) = explode("\t", $line);

		$retval[] = $word;

	}

	//
	// Put the words in alphabetical order for my own sanity.
	//
	sort($retval);

	fclose($fp);

	return($retval);

} // End of readWordListEff()


/**
* Create our Javascript, but as an array
*
* @param array $words Our array of words
*
* @param array $param Our array of params
*
* @return string Javascript which defines an array of those words
*/
function getJsArray($words, $params) {

	$url = "(unknown)";

	if (isset($params["dice"])) {
		$url = "http://norvig.com/ngrams/";

	} else if (isset($params["eff"])) {
		$url = "https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases";

	}


	$retval = ""
		. "//\n"
		. "// Our wordlist.\n"
		. "//\n"
		. "// Originally obtained from: $url\n"
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
function main($argv) {

	$params = parseArgs($argv);
	//print_r($params); // Debugging

	//
	// Read our file
	//
	if (isset($params["dice"])) {
		$filename = "count_1w.txt";
		$words = readWordListPeterNorvig($filename, $params["dice"]);
		//print_r($words); // Debugging

	} else if (isset($params["eff"])) {
		//
		// Handle wordllist from https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
		//
		$filename = "eff_large_wordlist.txt";
		$words = readWordListEff($filename);
		//print_r($words); // Debugging

	}


	//
	// Get our Javascript
	//
	$js = getJsArray($words, $params);

	print $js;

} // End of main()


main($argv);


