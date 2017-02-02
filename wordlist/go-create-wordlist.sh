#!/bin/bash
#
# Wrapper to create our wordlist from any directory
#

# Errors fatal
set -e

pushd $(dirname $0) > /dev/null

JS="wordlist.js"

echo "# "
echo "# Creating wordlist Javascript..."
echo "# "

#./create-wordlist.php # Debugging
./create-wordlist.php > ${JS}

echo "# "
echo "# Done!  List created at ${JS}"
echo "# "


