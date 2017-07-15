'use strict';

const TwitterClient = require('./src/lib/api/twitter-client');
const tracery = require(`tracery-grammar`);
const the_pros = require(`./src/grammar.json`);
const fs =  require(`fs`);
const logFile = `./debug.log`;
const TWEET_LENGTH = 140;

// Create tweet from grammar
const grammar = tracery.createGrammar(the_pros);
grammar.addModifiers(tracery.baseEngModifiers); 
const ORIGIN = `#origin#`;
const generate = () => grammar.flatten(ORIGIN);

let fileLogger = (msg) => {
    console.log(`${msg}`);
    fs.appendFile(logFile, `${msg}\n`, (err) => {
        if (err) throw err;
    });
};

let tweet = generate();
while (tweet.length > TWEET_LENGTH) {
    fileLogger(`ERROR: TWEET LENGTH ${tweet.length} GREATER THAN MAX ${TWEET_LENGTH}:\n${tweet}`);
    tweet = generate()
}

fileLogger(`${tweet}`);

// Create twitter client
const twitter = new TwitterClient();

twitter.postTweet(tweet);
