'use strict';

const fs =  require(`fs`);
const uuid = require(`uuid`);
const grammar = require(`./src/data/grammar.json`);

const HeadlineMaker = require('./src/headline-maker');
const TwitterClient = require('./src/lib/api/twitter-client');
const mtgCardFinder = require('./src/lib/api/mtg-cardfinder');

const logFile = `./debug.log`;
const TWEET_LENGTH = 140;

const headlines = new HeadlineMaker(grammar);

const fileLogger = (msg, isErr) => {
	const logToConsole = isErr ? console.error : console.log;

    logToConsole(`${msg}`);

    fs.appendFile(logFile, `${msg}\n`, (err) => {
        if (err) throw err;
    });
};
const logError = (msg, error) => fileLogger(`ERROR: ${msg}`, true);

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

// Create tweet from grammar
let headline = headlines.generateHeadline();

while (headline.text.length > TWEET_LENGTH) {
    logError(`TWEET LENGTH ${headline.text.length} GREATER THAN MAX ${TWEET_LENGTH}:\n${headline.text}`);
	headline = headlines.generateHeadline();
}

fileLogger(`tweet: ${JSON.stringify(headline)}`);

// Create twitter client
const twitter = new TwitterClient();

if (headline.tags && headline.tags.imgCard && headline.tags.imgCard.cardName) {
	postCardImageTweet(headline.text, headline.tags.imgCard.cardName);
} else {
	twitter.postTweet(headline.text);
}