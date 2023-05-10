#!/bin/bash
#
# Sync up all of our files to the S3 bucket
#

# Errors are fatal
set -e

pushd $(dirname $0) > /dev/null

echo "# Syncing files to AWS S3 bucket..."
aws s3 sync . s3://diceware.dmuth.org/ --exclude ".*" --exclude "node_modules/*" --delete

echo "# Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E2TUL4ST85ZH5Y --paths "/*"

echo "# Done!"

