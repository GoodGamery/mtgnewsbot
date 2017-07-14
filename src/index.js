'use strict';
const MtgNewsBot = require('./mtgnewsbot');

const numExamples = process.argv[2] || 30;
const headlines = MtgNewsBot.generateHeadlines(numExamples);
headlines.forEach(headline => {
	console.log("\n * " + headline);
});