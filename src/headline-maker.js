'use strict';

const tracery = require(`tracery-grammar`);

class HeadlineMaker {

  constructor(grammar) {
    this.grammar = tracery.createGrammar(grammar);
    this.grammar.addModifiers(tracery.baseEngModifiers);
    this.origin = `#origin#`;
  }

  /**
  * Generates a headline and returns a headline object in the following format:	 
  */
  generateHeadline() {
    return parseMessage(this.grammar.flatten(this.origin));
  }

  /**
	* Generates a headline and returns its text contents, with any tags stripped out
	*/
	generateTextHeadline() {
		return this.generateHeadline().text;
	}
}

module.exports = HeadlineMaker;

/**
 * Object representation of a headline, with the format:
 * {
 *		text {string}: text of the headline, with any tags stripped out, as a string
 * 		tags {Object}: a map of tags and their attributes, if the headline contains any. otherwise undefined.
 * }
 *	
 * Expected tag format is {tagname attr1="one" attr2="two"} and is parsed as
 *	tagname: { 
 *		attr1: "one",
 * 		attr2 = "two" 
 *  }
 */
class Headline {
	constructor(text, tags) {
		this.text = text;
		if (tags) {
			this.tags = tags;
		}
		Object.freeze(this);
	}
}

function parseMessage(message) {
	let tags = undefined;
	let text = message;

	let match = message.match(/\{\w+?\s+?.*?\}/g);
	if (match) {
		tags = {};
		match.forEach(match => {
			const tag = match.match(/\{(\w+)\s/)[1];
			if (!tags[tag]) {
				tags[tag] = match.match(/(\w+=".*?")/g).reduce((result, next) => {
					let key = next.match(/(\w+)=/)[1];
					let value = next.match(/="(.*)"/)[1];
					result[key] = value;
					return result;
				}, {});
			}
			text = message.replace(match,'');
		});

        // Further process svg tags
        if (tags.svg && tags.svg.svgString) {
            tags.svg.svgString = tags.svg.svgString
                .replace(/`/g, '"');    // This gets quotes working
        }
	}



	return new Headline(text.trim().replace(/\s+/g,' '), tags);
}