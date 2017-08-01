'use strict';
const fs =  require(`fs`);
const path = require('path');
const uuid = require(`uuid`);
const svg2png = require(`svg2png`);

const RenderImage = require('./src/lib/render-image');
const Discord = require('./src/lib/discord');
const NewsEngine = require('./src/news-engine');
const TwitterClient = require('./src/lib/api/twitter-client');
const mtgCardFinder = require('./src/lib/api/mtg-cardfinder');
const config = require('./config');

// Create twitter client
const twitter = new TwitterClient();

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
	const outputfile = cardName.replace(/\s+/g, '-').toLowerCase() + '-' + uuid() + '.jpg';
	const outputPath = config.paths.tempDirectory + '/' + outputfile;

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

function resolveCssUrls(html) {
	var newHtml = html.toString();

	function fileUrl(url) {
    var pathName = path.resolve(url).replace(/\\/g, '/');
    // windows drive letters must be prefixed with a slash
    if (pathName[0] !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
	}

	const matches = newHtml.match(/url\(\..*?\)/g);
	if (!matches) {
		return html;
	}
	matches.forEach(match => {
		newHtml = newHtml.replace(match, 'url('+ fileUrl(match.match(/url\((\..*?)\)/)[1])  + ')');
	});
	return newHtml;
}

function cleanupFile(outputPath) {
	return fs.unlink(outputPath, (err) => {
		if (!err) {
			console.log('Deleted ' + outputPath);
		} else {
			logError('Unable to delete local image file: ' + err);
		}
	});
}

function postHtmlImageTweet(status, htmlString, altText) {
	const outputfile = uuid() + '.png';
	const outputPath = config.paths.tempDirectory + '/' + outputfile;

	console.log('postHtmlImageTweet | html:\n' + htmlString);

	RenderImage.fromHtml(htmlString, outputPath)
		.then(localFilePath => postImageTweet(localFilePath, status, altText))
		.then(() => cleanupFile(outputPath))
		.catch(e => logError('Failed to download image: ' + e));
}

try {
	// Create tweet from grammar
	let headline = NewsEngine.generateHeadline();

	while (headline.text.length > config.tweetLength) {
		logError(`TWEET LENGTH ${headline.text.length} GREATER THAN MAX ${config.tweetLength}:\n${headline.text}`);
		headline = NewsEngine.generateHeadline();
	}

	fileLogger(`tweet: ${JSON.stringify(headline)}`);

	if (headline.tags && headline.tags.imgCard && headline.tags.imgCard.cardName) {
		postCardImageTweet(headline.text, headline.tags.imgCard.cardName);
	} else if (headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
		const html = resolveCssUrls(headline.tags.htmlImg.htmlImgString);
		postHtmlImageTweet(headline.text, html, headline.tags.htmlImg.altText || 'image');
	} else if (headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		postSvgTweet(headline.text, headline.tags.svg.svgString, headline.tags.svg.altText || 'image');
	} else {
		twitter.postTweet(headline.text);
	}
	// Notify about tweet
	Discord.sendEmbed(`${headline.text}`, `https://twitter.com/MTGnewsbot`);
} catch (exception) {
	// Notify about error
	Discord.sendError(`Error: ${exception}`);
}
