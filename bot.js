'use strict';

const tracery = require(`tracery-grammar`);
const fs =  require(`fs`);
const uuid = require(`uuid`);

const TwitterClient = require('./src/lib/api/twitter-client');
const mtgCardFinder = require('./src/lib/api/mtg-cardfinder');
const the_pros = require(`./src/grammar.json`);

const logFile = `./debug.log`;
const TWEET_LENGTH = 140;

// Create tweet from grammar
const grammar = tracery.createGrammar(the_pros);
grammar.addModifiers(tracery.baseEngModifiers);
const ORIGIN = `#origin#`;
const generate = () => grammar.flatten(ORIGIN);

let fileLogger = (msg, isErr) => {
	const logToConsole = isErr ? console.error : console.log;

    logToConsole(`${msg}`);

    fs.appendFile(logFile, `${msg}\n`, (err) => {
        if (err) throw err;
    });
};

let logError = (msg, error) => fileLogger(`ERROR: ${msg}`, true);

function parseMessage(message) {
	let tags = undefined;
	let status = message;
	let match = message.match(/\{\w+?\s+?.*?\}/g);
	if (match) {
		tags = {};
		match.forEach(match => {
			const tag = match.match(/\{(\w+)\s/)[1];
			if (!tags[tag]) {
				tags[tag] = match.match(/(\w+=".*?")/g).reduce((result, next) => {
					let key = next.match(/(\w+)=/)[1];
					let value = next.match(/="(.*)"/)[1];
					result[key] = value;
					return result;
				}, {});
			}
			status = message.replace(match,'');
		});	
	}
	return {
		status: status.trim().replace(/\s+/g,' '),
		tags: tags
	};
}

function postCardImageTweet(status, cardName) {
	const outputfile = cardName.replace(/\s+/g, '-').toLowerCase() + '-' + uuid() + '.png';
	const outputDir = '/tmp';
	const outputPath = outputDir + '/' + outputfile;	

	mtgCardFinder.downloadCardImage(cardName, outputPath)
		.then(localFilePath => twitter.uploadTwitterImage(localFilePath))
		.catch(e => logError('Failed to upload image: ' + e))
		.then(twitterImage => twitter.postImageTweet(twitterImage, cardName, status))
		.catch(e => logError('Failed to post tweet: ' + e))
		.then(() => {
		    return fs.unlink(outputPath, (err) => {
		      if (!err) {
		        console.log('Deleted ' + outputPath);
		      } else {
		        logError('Unable to delete local image file: ' + err);
		      }
			});
		})
		.catch(e => logError('Failed to download image: ' + e));
}

let tweet = parseMessage(generate());

while (tweet.status.length > TWEET_LENGTH) {
    logError(`TWEET LENGTH ${tweet.length} GREATER THAN MAX ${TWEET_LENGTH}:\n${tweet}`);
	tweet = parseMessage(generate());
}

fileLogger(`tweet: ${JSON.stringify(tweet)}`);

// Create twitter client
const twitter = new TwitterClient();

if (tweet.tags && tweet.tags.imgCard && tweet.tags.imgCard.cardName) {
	postCardImageTweet(tweet.status, tweet.tags.imgCard.cardName);
} else {
	twitter.postTweet(tweet.status);
}