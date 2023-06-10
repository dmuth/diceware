#!/bin/bash
#
# Script to run the script in dev mode, which will spawn a shell
#

# Errors are fatal
set -e

# Change to the parent directory
pushd $(dirname $0)/.. > /dev/null

PORT=${PORT:=8000}

docker run --rm -it -p ${PORT}:80 -v $(pwd):/mnt diceware


