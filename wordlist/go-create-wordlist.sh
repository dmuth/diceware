#!/bin/bash
#
# Wrapper to create our wordlist from any directory
#

# Errors fatal
set -e

pushd $(dirname $0) > /dev/null


JS="wordlist-5-dice.js"
echo "# "
echo "# Creating wordlist '$JS'..."
echo "# "
./create-wordlist.php --dice 5 > ${JS}

JS="wordlist-6-dice.js"
echo "# "
echo "# Creating wordlist '$JS'..."
echo "# "
./create-wordlist.php --dice 6 > ${JS}

JS="wordlist-7-dice.js"
echo "# "
echo "# Creating wordlist '$JS'..."
echo "# "
./create-wordlist.php --dice 7 > ${JS}

echo "# "
echo "# Done!"
echo "# "


