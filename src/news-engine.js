'use strict';
const tracery = require(`tracery-grammar`);
const the_pros = require(`./grammar.json`);
const grammar = tracery.createGrammar(the_pros);

grammar.addModifiers(tracery.baseEngModifiers);

function generateHeadlines (numHeadlines) {
	const headlines = [];
	for (let i = 0; i < numHeadlines; ++i) {
		headlines.push(grammar.flatten('#origin#'));
	}
	return headlines;
}

module.exports = { generateHeadlines: generateHeadlines };
