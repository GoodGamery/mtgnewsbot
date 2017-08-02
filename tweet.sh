#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

#noisy
set -x

#log the path
echo $PATH

#log node version
node -v

# install fonts
cp ./src/data/fonts/*.ttf /usr/local/share/fonts

# install dependencies
npm install --production

# tweet
node ./src/bot.js

#silent
set +x
