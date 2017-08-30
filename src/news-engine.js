const config = require('../config');
const HeadlineMaker = require('./headline-maker');
const buildGrammar = require('./build-grammar');

const DEFAULT_ORIGIN_STRING = `#origin#`;

class NewsEngine {
  constructor() {
    // load the default grammar
    this.grammar = buildGrammar(config.defaultGrammarPath);
    // Override the origin
    this.grammar["origin"] = config.origin || this.grammar["origin"];

    if (config.origin) {
      console.info(`Grammar origin was overridden to ${JSON.stringify(this.grammar.origin)}`);
    }

    this.headlineMaker = new HeadlineMaker(this.grammar);
  }

  async generateHeadline (customOrigin) {
    return await this.headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING);
  }

  async generateHeadlines (customOrigin, numHeadlines) {
    const headlines = [];
    for (let i = 0; i < numHeadlines; ++i) {
      headlines.push(await this.headlineMaker.generateHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
    }
    return headlines;
  }

  async generateTextHeadlines (customOrigin, numHeadlines) {
    const headlines = [];
    for (let i = 0; i < numHeadlines; ++i) {
      await headlines.push(this.headlineMaker.generateTextHeadline(customOrigin || DEFAULT_ORIGIN_STRING));
    }
    return headlines;
  }
}

module.exports = NewsEngine;
