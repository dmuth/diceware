#!/bin/bash
#
# Push our Docker image our Docker Hub.
#

# Errors are fatal
set -e

# Change to the parent directory of this script
pushd $(dirname $0)/.. > /dev/null

docker tag diceware dmuth1/diceware
docker push dmuth1/diceware


