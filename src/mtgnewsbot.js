// Entry point for news generation
'use strict';

const uuid = require(`uuid`);
const NewsEngine = require('./news-engine');
const RenderImage = require('./lib/render-image');
const config = require('../config');

class MtgNewsbot {
  static run(options) {

    // Combine with default options
    this.options = Object.assign({
      count: 1,
      origin: '#origin#',
      verbose: false,
      tweet: false,
      discord: false
    }, options);

    // Time to log
    if (this.options.verbose) {
      console.log(`Options:`);
      console.log(` - Count: ${this.options.count}`);
      console.log(` - Origin: "${this.options.origin}"`);
      console.log(` - Verbose: ${this.options.verbose}`);
      console.log(` - Tweet: ${this.options.tweet}`);
      console.log(` - Discord: ${this.options.discord}`);
    }

    const headlines = NewsEngine.generateHeadlines(this.options.origin, this.options.count);

    headlines.forEach(headline => {
      console.log("\n * " + headline.text);
      const outputPath = `${config.paths.tempDirectory}/${uuid()}.png`;
      RenderImage.fromHeadline(headline, outputPath)
        .then(result => console.info(result.msg))
        .catch(e => console.error('Failed to render image: ' + e));
    });
  }
}

module.exports = MtgNewsbot;
