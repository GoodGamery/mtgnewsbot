'use strict';

const fs =  require(`fs`);
const path = require('path');
const uuid = require(`uuid`);
const svg2png = require(`svg2png`);
const html2png = require('html2png');
const gm = require('gm');

const NewsEngine = require('./src/news-engine');
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

function postImageTweet(imageFilePath, status, cardName) {
	twitter.uploadTwitterImage(imageFilePath)
		.catch(e => logError('Failed to upload image: ' + e))
		.then(twitterImage => twitter.postImageTweet(twitterImage, cardName, status))
		.catch(e => logError('Failed to post tweet: ' + e));
}

function postCardImageTweet(status, cardName) {
	const outputPath = config.paths.tempDirectory + '/' + outputfile;	
	const outputfile = cardName.replace(/\s+/g, '-').toLowerCase() + '-' + uuid() + '.jpg';

	mtgCardFinder.downloadCardImage(cardName, outputPath)
		.then(localFilePath => postImageTweet(localFilePath, status, cardName))
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

function postSvgTweet(status, svgString, altText) {
	altText = altText || "Rendered Image";
	svg2png(new Buffer(svgString), { filename: path.resolve(__dirname, 'src') })
		.catch(e => logError('Failed to create png: ' + e))
		.then(data => twitter.uploadTwitterImageData(data.toString('base64')))
		.catch(e => logError('Failed to upload image: ' + e))
		.then(twitterImage => twitter.postImageTweet(twitterImage, altText, status))
		.catch(e => logError('Failed to post tweet: ' + e));
}

function renderImageFromHtml(html, outputPath) {
	return new Promise((resolve, reject) => {
		const screenshot = html2png({ width: 1024, height: 768, browser: 'phantomjs'});
		
		html = headline.tags.htmlImg.htmlImgString.replace(/`/g, '"');
		console.log('HTML:'); console.log(html);

		screenshot.render(html, function (err, data) { 
			if (err) { console.log('\n *** Failed to create png:'); reject(err); return; }
			console.log('\n *** Raw image saved to ' + outputPath + '. Trimming extra whitespace from image...');

			gm(data).trim()
			.write(outputPath,  err => {	
				if (!err) {
					console.log('\n *** Image saved to ' + outputPath);					
					resolve(outputPath);							
				}	else {
					console.error('\n *** Failed to write to trimmed png:');
					reject(err);
				}
				screenshot.close();				
			});
		});
	});
}

function postHtmlImageTweet(status, htmlString, altText) {
	const outputfile = uuid() + '.png';	
	const outputPath = config.paths.tempDirectory + '/' + outputfile;	

	renderImageFromHtml(htmlString, outputPath)
		.then(localFilePath => postImageTweet(localFilePath, status, altText))
		.then(() => {
   //    return fs.unlink(outputPath, (err) => {
			// 	if (!err) {
			// 		console.log('Deleted ' + outputPath);
			// 	} else {
			// 		logError('Unable to delete local image file: ' + err);
			// 	}
			// });
		})
		.catch(e => logError('Failed to download image: ' + e));
}

// Create tweet from grammar
let headline = NewsEngine.generateHeadline();

while (headline.text.length > config.tweetLength) {
  logError(`TWEET LENGTH ${headline.text.length} GREATER THAN MAX ${config.tweetLength}:\n${headline.text}`);
	headline = NewsEngine.generateHeadline();
}

fileLogger(`tweet: ${JSON.stringify(headline)}`);

// Create twitter client
const twitter = new TwitterClient();

if (headline.tags && headline.tags.imgCard && headline.tags.imgCard.cardName) {
	postCardImageTweet(headline.text, headline.tags.imgCard.cardName);
} else if (headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
	postHtmlImageTweet(headline.text, headline.tags.htmlImg.htmlImgString.replace(/`/g, '"'), headline.tags.htmlImg.altText || 'image');
} else if (headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
	postSvgTweet(headline.text, headline.tags.svg.svgString.replace(/`/g, '"'), headline.tags.svg.altText || 'image');
} else {
	twitter.postTweet(headline.text);
}