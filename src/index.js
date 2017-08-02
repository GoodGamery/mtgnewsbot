'use strict';

const NewsEngine = require('./news-engine');
const config = require('../config');
const uuid = require(`uuid`);
const RenderImage = require('./lib/render-image');

// Command line arguments, eg. npm start 5 #realCard#
const numExamples = process.argv[2] || 1;
const customOrigin = process.argv[3] || "#origin#";

if (process.argv[3])
	console.info(`Custom string to flatten is ${customOrigin}`);

const headlines = NewsEngine.generateHeadlines(customOrigin, numExamples);

headlines.forEach(headline => {
	console.log("\n * " + headline.text);
	if (headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		console.log(" - (Includes an SVG image)");
	}

	const outputPath = `${config.paths.tempDirectory}/${uuid()}.png`;

	RenderImage.fromHeadline(headline, outputPath)
		.then(result => console.info(result.msg))
		.catch(e => console.error('Failed to render image: ' + e));
});
