#!/bin/bash

# Export env vars for twitter tokens
set -a
. ./.env
set +a

node bot.js
