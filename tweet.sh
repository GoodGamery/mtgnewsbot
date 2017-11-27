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
  [ -z "$2" ]
then 
  # tweet random headline
  echo "generating random headline"
  node --harmony mtgnews --tweet --toot --discord
else
  # tweet specified headline
  echo "generating headline with origin \"#$2#\""  
  node --harmony mtgnews --tweet --toot --discord -o "#$2#"
fi

#silent
set +x
