'use strict';
const Twit = require('twit');
const tracery = require(`tracery-grammar`);
const the_pros = require(`./src/grammar.json`);

// Create tweet from grammar
const grammar = tracery.createGrammar(the_pros);
grammar.addModifiers(tracery.baseEngModifiers); 
const tweet = grammar.flatten("#origin#");

// Create twitter client
var T = new Twit(
    { consumer_key:         process.env.TWITTER_CONSUMER_KEY
    , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
    , access_token:         process.env.TWITTER_ACCESS_TOKEN
    , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
);

console.log(`Tweeting tweet:\n${tweet}`);

T.post('statuses/update', { status: tweet }, function(err, data, response) {
    if (err) {
        console.log(err);
        console.log(data);
    }
})
