'use strict';
const fs =  require(`fs`);
const uuid = require(`uuid`);

const config = require('../config');

const RenderImage = require('./lib/render-image');
const Discord = require('./lib/discord');
const NewsEngine = require('./news-engine');
const TwitterClient = require('./lib/api/twitter-client');
const mtgCardFinder = require('./lib/api/mtg-cardfinder');

// Create twitter client
const twitter = new TwitterClient();

function postTweet(headline) {
	const outputfile = uuid() + '.png';
	const outputPath = config.paths.tempDirectory + '/' + outputfile;
	const altText = headline.tags.htmlImg.altText || 'image';
	const statusText = headline.text;

	RenderImage.fromHeadline(headline, outputPath)
		.then(result => {
			if (result.rendered) {
				postImageTweet(result.path, statusText, altText);
			} else {
				twitter.postTweet(statusText);
			}
		})
		.then(() => cleanupFile(outputPath))
		.catch(e => console.error('Failed to download image: ' + e));
}

function postImageTweet(imageFilePath, status, cardName) {
	twitter.uploadTwitterImage(imageFilePath)
		.catch(e => console.error('Failed to upload image: ' + e))
		.then(twitterImage => twitter.postImageTweet(twitterImage, cardName, status))
		.catch(e => console.error('Failed to post tweet: ' + e));
}

function postCardImageTweet(status, cardName) {
	const outputfile = cardName.replace(/\s+/g, '-').toLowerCase() + '-' + uuid() + '.jpg';
	const outputPath = config.paths.tempDirectory + '/' + outputfile;
	mtgCardFinder.downloadCardImage(cardName, outputPath)
		.then(localFilePath => postImageTweet(localFilePath, status, cardName))
		.then(() => cleanupFile(outputPath))
    .catch(e => console.error('Failed to download image: ' + e));
}

function cleanupFile(outputPath) {
	return fs.unlink(outputPath, (err) => {
		if (!err) {
			console.log('Deleted ' + outputPath);
		} else {
			console.error('Unable to delete local image file: ' + err);
		}
	});
}

try {
	// Create tweet from grammar
	let headline = NewsEngine.generateHeadline();

	while (headline.text.length > config.tweetLength) {
		console.error(`TWEET LENGTH ${headline.text.length} GREATER THAN MAX ${config.tweetLength}:\n${headline.text}`);
		headline = NewsEngine.generateHeadline();
	}

	console.log(`tweet: ${JSON.stringify(headline)}`);

	if (headline.tags && headline.tags.imgCard && headline.tags.imgCard.cardName) {
		postCardImageTweet(headline.text, headline.tags.imgCard.cardName);
	} else {
		postTweet(headline);
	}
	// Notify about tweet
	Discord.sendEmbed(`${headline.text}`, config.twitterLink);
} catch (exception) {
	// Notify about error
	Discord.sendError(`Error: ${exception}`);
}
