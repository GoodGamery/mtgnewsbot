#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

# update source
git fetch
git pull

# tweet
node bot.js
