#!/bin/bash

# update source
git fetch
git pull

# do a tweet
sh ./tweet.sh "$@"