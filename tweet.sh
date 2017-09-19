#!/bin/bash

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
node --harmony mtgnews --tweet --toot --discord

#silent
set +x
