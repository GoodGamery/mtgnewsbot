'use strict';
const chalk = require('chalk');
const tracery = require(`tracery-grammar`);
const the_pros = require(`./grammar.json`);
const grammar = tracery.createGrammar(the_pros);

grammar.addModifiers(tracery.baseEngModifiers); 

const numExamples = process.argv[2] || 10;
for (let i = 0; i < numExamples; ++i) {
    console.log("\n * " + grammar.flatten('#origin#'));
}
