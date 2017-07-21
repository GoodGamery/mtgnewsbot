'use strict';

const NewsEngine = require('./news-engine');
const config = require('../config');
const fs =  require(`fs`);
const uuid = require(`uuid`);
const svg2png = require('svg2png');

const numExamples = process.argv[2] || 30;
const headlines = NewsEngine.generateHeadlines(numExamples);
headlines.forEach(headline => {
	console.log("\n * " + headline.text);

	if(headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		const outputfile = uuid() + '.png';
		const outputPath = config.paths.tempDirectory + '/' + outputfile;

		svg2png(new Buffer(headline.tags.svg.svgString.replace(/`/g, '"')), { filename: __dirname })
			.catch(e => console.log('\n *** Failed to create png: ' + e))
			.then(data => {
				fs.writeFileSync(outputPath, data);
				console.log('\n *** Image saved to ' + outputPath);
			})
			.catch(e => console.log('\n *** Failed to save image: ' + e));
	}
});
