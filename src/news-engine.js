'use strict';

const HeadlineMaker = require('./headline-maker');
const config = require('../config');
const DEFAULT_ORIGIN_STRING = `#origin#`;

const grammar = config.defaultGrammar;
grammar["origin"] = config.origin || grammar["origin"];
console.info(`Grammar origin object is ${JSON.stringify(grammar.origin)}`);

const headlineMaker = new HeadlineMaker(grammar);

function generateHeadline (customOrigin) {
	return headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING);
}

function generateHeadlines (customOrigin, numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
	}
	return headlines;
}

function generateTextHeadlines (customOrigin, numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(headlineMaker.generateTextHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
	}
	return headlines;
}

module.exports = {
	generateHeadline: generateHeadline,
	generateHeadlines: generateHeadlines,
	generateTextHeadlines: generateTextHeadlines
};
