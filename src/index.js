'use strict';

const NewsEngine = require('./news-engine');

const numExamples = process.argv[2] || 30;
const headlines = NewsEngine.generateHeadlines(numExamples);
headlines.forEach(headline => {
	console.log("\n * " + headline.text);
});
