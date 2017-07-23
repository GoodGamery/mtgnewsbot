'use strict';

const NewsEngine = require('./news-engine');
const config = require('../config');
const fs =  require(`fs`);
const uuid = require(`uuid`);
const svg2png = require('svg2png');
const html2png = require('html2png');
const gm = require('gm');

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
				console.log('SVG:'); console.log(headline.tags.svg.svgString.replace(/`/g, '"'));
				fs.writeFileSync(outputPath, data);
				console.log('\n *** Image saved to ' + outputPath);
			})
			.catch(e => console.log('\n *** Failed to save image: ' + e));
	}

	if(headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
		const outputfile = uuid() + '.png';
		const outputPath = config.paths.tempDirectory + '/' + outputfile;
		const screenshot = html2png({ width: 1024, height: 768, browser: 'phantomjs'});
		const html = headline.tags.htmlImg.htmlImgString.replace(/`/g, '"');
		console.log('HTML:'); console.log(html);

		screenshot.render(html, function (err, data) { 
			if (err) { console.log('\n *** Failed to create png: ' + err); return; }
			gm(data).trim()
			.write(outputPath,  err => {	
				if (err) {  console.error('ERROR: ' + err); return err; }	
        console.log('wrote image data file to ' + outputPath);
				screenshot.close();
			});
		});	  
	}
});
