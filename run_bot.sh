#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

# update source
git fetch
git pull

#### DEBUGGING
# print out version of node
node -v
# print out current user
echo "$USER"

# tweet
node --use_strict bot.js
