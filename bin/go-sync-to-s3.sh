#!/bin/bash
#
# Sync up all of our files to the S3 bucket
#

# Errors are fatal
set -e

pushd $(dirname $0)/.. > /dev/null

echo "# Syncing files to AWS S3 bucket..."
aws s3 sync . s3://diceware.dmuth.org/ --exclude ".*" --exclude "node_modules/*" --delete

HOSTNAME="diceware.dmuth.org"
ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[?contains(@, '${HOSTNAME}')]]" \
  | jq -r .[].Id)

if test ! "${ID}"
then
  echo "! No CloudFront distribution ID found, something has gone wrong.  Aborting!"
  exit 1
fi

echo "# Found Cloudfront distribution ID: ${ID}"

echo "# Invalidating cache... "
aws cloudfront create-invalidation --distribution-id ${ID} --paths "/*"

echo "# Getting current invalidations..."
echo
./bin/get-cloudfront-cache-invalidations.sh ${ID} | head -n5
echo

echo "# "
echo "# To keep track of invalidation status so you know when complete, run this command:"
echo "# ./bin/get-cloudfront-cache-invalidations.sh ${ID} | head -n5"
echo "# "

echo "# Done!"

