// Entry point for news generation
'use strict';

const uuid = require(`uuid`);
const NewsEngine = require('./news-engine');
const RenderImage = require('./lib/render-image');
const config = require('../config');
const TwitterClient = require('./lib/api/twitter-client');
const Discord = require('./lib/discord');

class MtgNewsbot {
  constructor(options) {
    this.twitter = null;

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

    if (this.options.tweet) {
      // Restrict to a single tweet
      this.options.count = 1;
      // Create twitter client
      this.twitter = new TwitterClient(config);
    }
  }

  run() {
    const headlines = NewsEngine.generateHeadlines(this.options.origin, this.options.count);

    headlines.forEach(headline =>
      this.processHeadline(headline)
        .then(result => {
          if (this.options.verbose)
            console.log(`Final result:\n${result}`);
        })
        .catch(err => {
          console.error(err);
          Discord.sendError(`Error:\n${err}`);
        })
    );
  }

  async processHeadline(headline) {
    let postedMessage = headline.text;
    console.log(`\n* ${headline.text}`);
    const outputPath = `${config.paths.tempDirectory}/${uuid()}.png`;
    const renderResult = await RenderImage.fromHeadline(headline, outputPath);
    if (renderResult.rendered) {
      console.log("Render result: " + renderResult.msg);
    }

    // Twitter
    if (this.options.tweet && !this.options.debug) {
      let tweetResult = null;
      if (renderResult.rendered) {
        tweetResult = await this.twitter.postTweet(headline.text, renderResult.path, headline.altText);
      } else {
        tweetResult = await this.twitter.postTweet(headline.text);
      }
      const tweetId = tweetResult.id_str;
      const tweetUser = tweetResult.user.screen_name;
      postedMessage = `https://twitter.com/${tweetUser}/status/${tweetId}`;
    }

    // Discord
    if (this.options.discord) {
      // Do something with the message for discord
      console.log(`Sending to ${this.options.debug ? `DEBUG` : `NORMAL`} discord: "${postedMessage}"`);
      if (this.options.debug)
        Discord.sendDebug(postedMessage);
      else
        Discord.sendText(postedMessage);
    }

    return Promise.resolve(postedMessage);
  }
}

module.exports = MtgNewsbot;
