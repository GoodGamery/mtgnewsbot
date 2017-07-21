'use strict';

const HeadlineMaker = require('./headline-maker');
const config = require('../config');

const grammar = config.defaultGrammar;
grammar["origin"] = config.origin || grammar["origin"];

const headlineMaker = new HeadlineMaker(grammar);

function generateHeadline () {
	return headlineMaker.generateHeadline();
}

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
	generateHeadline: generateHeadline,
	generateHeadlines: generateHeadlines,
	generateTextHeadlines: generateTextHeadlines
};
