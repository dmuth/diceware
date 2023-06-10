#!/bin/bash
#
# Push our Docker image our Docker Hub.
#

# Errors are fatal
set -e

# Change to the parent directory of this script
pushd $(dirname $0)/.. > /dev/null

docker tag fastapi-httpbin dmuth1/fastapi-httpbin
docker push dmuth1/fastapi-httpbin


