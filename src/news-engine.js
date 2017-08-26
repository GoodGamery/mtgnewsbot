'use strict';

const HeadlineMaker = require('./headline-maker');
const config = require('../config');
const DEFAULT_ORIGIN_STRING = `#origin#`;

const grammar = config.defaultGrammar;
grammar["origin"] = config.origin || grammar["origin"];
console.info(`Grammar origin object is ${JSON.stringify(grammar.origin)}`);

const headlineMaker = new HeadlineMaker(grammar);

async function generateHeadline (customOrigin) {
	return await headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING);
}

async function generateHeadlines (customOrigin, numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(await headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
	}
	return headlines;
}

async function generateTextHeadlines (customOrigin, numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		await headlines.push(headlineMaker.generateTextHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
	}
	return headlines;
}

module.exports = {
	generateHeadline: generateHeadline,
	generateHeadlines: generateHeadlines,
	generateTextHeadlines: generateTextHeadlines
};
