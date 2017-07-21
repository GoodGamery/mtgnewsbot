#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

#noisy

set -x
# update source
git fetch
git pull

# install dependencies
npm install --production

#log the path
echo $PATH

#log node version
node -v

# tweet
node --harmony --use_strict bot.js

#silent
set +x
