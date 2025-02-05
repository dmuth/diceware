#!/bin/bash
#
# This script lists Cloudfront invalidations for a given distribution ID.
#

# Errors are fatal
set -e

ID=""
if test ! "$1"
then
    echo "! "
    echo "! Syntax: $0 ID"
    echo "! "
    exit 1
fi

ID=$1

aws cloudfront list-invalidations \
    --distribution-id ${ID} \
    --query "InvalidationList.Items[*].[Id,CreateTime,Status]" \
    --output text

