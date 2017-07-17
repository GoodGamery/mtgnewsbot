'use strict';

const HeadlineMaker = require('./headline-maker');
const config = require('../config');

const headlineMaker = new HeadlineMaker(config.defaultGrammar);

function generateHeadlines (numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(headlineMaker.generateHeadline());
	}
	return headlines;
}

function generateTextHeadlines (numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(headlineMaker.generateTextHeadline());
	}
	return headlines;
}

module.exports = { 
	generateHeadlines: generateHeadlines,
	generateTextHeadlines: generateTextHeadlines
};
