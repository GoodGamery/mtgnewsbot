#!/bin/bash

# update source
git fetch
git pull
git submodule update --init --recursive

# do a tweet
sh "./tweet.sh"
