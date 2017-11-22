#!/bin/bash

# update source
git fetch
git pull
git submodule update --remote

# do a tweet
sh ./tweet.sh "$@"