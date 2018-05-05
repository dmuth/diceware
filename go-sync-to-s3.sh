#!/bin/bash
#
# Sync up all of our files to the S3 bucket
#

# Errors are fatal
set -e

pushd $(dirname $0) > /dev/null

aws s3 sync . s3://diceware.dmuth.org/ --exclude ".*" --exclude "node_modules/*" --delete


