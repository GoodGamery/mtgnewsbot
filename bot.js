'use strict';

const fs =  require(`fs`);
const uuid = require(`uuid`);
const svg2png = require(`svg2png`);

const HeadlineMaker = require('./src/headline-maker');
const TwitterClient = require('./src/lib/api/twitter-client');
const mtgCardFinder = require('./src/lib/api/mtg-cardfinder');
const config = require('./config');

const fileLogger = (msg, isErr) => {
	const logToConsole = isErr ? console.error : console.log;

    logToConsole(`${msg}`);

    fs.appendFile(config.paths.logFile, `${msg}\n`, (err) => {
        if (err) throw err;
    });
};
const logError = msg => fileLogger(`ERROR: ${msg}`, true);

function postCardImageTweet(status, cardName) {
	const outputfile = cardName.replace(/\s+/g, '-').toLowerCase() + '-' + uuid() + '.jpg';
	const outputPath = config.paths.tempDirectory + '/' + outputfile;

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

function postSvgTweet(status, svgString, altText = "Rendered image") {
	svg2png(new Buffer(svgString))
		.catch(e => logError('Failed to create png: ' + e))
		.then(data => twitter.uploadTwitterImageData(data.toString('base64')))
		.catch(e => logError('Failed to upload image: ' + e))
		.then(twitterImage => twitter.postImageTweet(twitterImage, altText, status))
		.catch(e => logError('Failed to post tweet: ' + e));
}

// Create tweet from grammar
const headlines = new HeadlineMaker(config.defaultGrammar);
let headline = headlines.generateHeadline();

while (headline.text.length > config.tweetLength) {
  logError(`TWEET LENGTH ${headline.text.length} GREATER THAN MAX ${config.tweetLength}:\n${headline.text}`);
	headline = headlines.generateHeadline();
}

fileLogger(`tweet: ${JSON.stringify(headline)}`);

// Create twitter client
const twitter = new TwitterClient();

if (headline.tags && headline.tags.imgCard && headline.tags.imgCard.cardName) {
	postCardImageTweet(headline.text, headline.tags.imgCard.cardName);
} else if (headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
	postSvgTweet(headline.text, headline.tags.svg.svgString, headline.tags.svg.altText);
} else {
	twitter.postTweet(headline.text);
}