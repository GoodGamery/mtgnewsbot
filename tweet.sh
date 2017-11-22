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

if
  [ -z "$1" ]
then 
  # tweet random headline
  node --harmony mtgnews --tweet --toot --discord
else
  # tweet specified headline
  node --harmony mtgnews --tweet --toot --discord -o "#$1#"
fi

#silent
set +x
