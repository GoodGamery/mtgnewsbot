#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

# update source
git fetch
git pull

# install dependencies
npm install

# tweet
node --use_strict bot.js
