'use strict';

const NewsEngine = require('./news-engine');
const config = require('../config');
const fs =  require(`fs`);
const uuid = require(`uuid`);
const svg2png = require('svg2png');
const RenderImage = require('./lib/render-image');

// Command line arguments, eg. npm start 5 #realCard#
const numExamples = process.argv[2] || 1;
const customOrigin = process.argv[3] || "#origin#";

console.log('process.argv[2]: ' + process.argv[2]);
console.log('process.argv[3]: ' + process.argv[3]);

if (process.argv[3])
	console.info(`Custom string to flatten is ${customOrigin}`);

const headlines = NewsEngine.generateHeadlines(customOrigin, numExamples);

headlines.forEach(headline => {
	console.log("\n * " + headline.text);
	if (headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		console.log(" - (Includes an SVG image)");
	}

	if(headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		const outputfile = uuid() + '.png';
		const outputPath = config.paths.tempDirectory + '/' + outputfile;

		svg2png(new Buffer(headline.tags.svg.svgString), { filename: __dirname })
			.catch(e => console.log('\n *** Failed to create png: ' + e))
			.then(data => {
				console.log('SVG:'); console.log(headline.tags.svg.svgString);
				fs.writeFileSync(outputPath, data);
				console.log('\n *** Image saved to ' + outputPath);
			})
			.catch(e => console.log('*** Failed to render image: ' + e));
	}

	if(headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
		const outputfile = uuid() + '.png';
		const outputPath = config.paths.tempDirectory + '/' + outputfile;
		const html = headline.tags.htmlImg.htmlImgString;
		console.log('HTML:'); console.log(html);

		RenderImage.fromHtml(html, outputPath)
			.then(localFilePath => console.info('*** Image saved to ' + localFilePath))
			.catch(e => console.error('Failed to render image: ' + e));
	}
});
