// Entry point for news generation
'use strict';

const uuid = require(`uuid`);
const config = require('../config');
const NewsEngine = require('./news-engine');
const RenderImage = require('./lib/render-image');
const TwitterClient = require('./lib/api/twitter-client');
const MastodonClient = require('./lib/api/mastodon-client');
const Discord = require('./lib/discord');

class MtgNewsbot {
  constructor(options) {
    this.twitter = null;
    this.mastodon = null;

    this.newsEngine = new NewsEngine();

    // Combine with default options
    this.options = Object.assign({
      count: 1,
      origin: '#origin#',
      verbose: false,
      tweet: false,
      toot: false,
      discord: false
    }, options);

    // Time to log
    if (this.options.verbose) {
      console.log(`Options:`);
      console.log(` - Count:   ${this.options.count}`);
      console.log(` - Origin: "${this.options.origin}"`);
      console.log(` - Verbose: ${this.options.verbose}`);
      console.log(` - Tweet:   ${this.options.tweet}`);
      console.log(` - Toot:    ${this.options.toot}`);
      console.log(` - Discord: ${this.options.discord}`);
    }

    if (this.options.tweet) {
      this.options.count = 1; // Restrict to a single tweet
      this.twitter = new TwitterClient(config);
    }

    if (this.options.toot) {
      this.options.count = 1; // Restrict to a single toot
      this.mastodon = new MastodonClient(config);
    }
  }

  async run() {
    // Keep running until we have headlines of the correct text length for twitter
    let headlines = [];
    let maxTries = 10;  // Don't spin forever, ever
    while (headlines.length < this.options.count && (maxTries-- > 0)) {
      const moreHeadlines = await this.newsEngine.generateHeadlines(this.options.origin, this.options.count - headlines.length);
      headlines = headlines.concat(moreHeadlines.filter(s => s.text.length <= config.tweetLength));
    }

    if (headlines.length === 0) {
      console.error(`\nERR: No headlines were generated.`);
      if(this.options.tweet || this.options.toot || this.options.discord) {
        Discord.sendError(`No headlines were generated.`);
      }
    }

    headlines.forEach(headline =>
      this.processHeadline(headline)
        .then(result => {
          if (this.options.verbose) {
            console.log(`Final result:\n${result}`);
          }
        })
        .catch(err => {
          console.error(err);
          if (this.options.discord || this.options.tweet || this.options.toot)
            Discord.sendError(`${err}`);
        })
    );
  }

  static createFileName(headline) {
    const prefix = headline.text
      .toLowerCase()
      .replace(/ /g, `_`)
      .replace(/\W+/g, ``)
      .slice(0, 50);
    const suffix = uuid().slice(0, 13);
    return `${prefix}-${suffix}`;
  }

  async wait(seconds) {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), seconds*1000);
    });
  }

  // Do the tweet
  async tweet(headline, renderResult) {
    let tweetResult = null;
    if (renderResult.rendered) {
      tweetResult = await this.twitter.postTweet(headline.text, renderResult.path, headline.altText);
    } else {
      tweetResult = await this.twitter.postTweet(headline.text);
    }

    console.log(`Twitter status POST response:\n${JSON.stringify(tweetResult)}`);

    if (!tweetResult.user || !tweetResult.id_str) {
      const msg =  'The response was empty or invalid.';
      console.error(msg);
      throw new Error(msg);
    }

    const tweetId = tweetResult.id_str;
    const tweetUser = tweetResult.user.screen_name;
    return `https://twitter.com/${tweetUser}/status/${tweetId}`;
  }

  async toot(headline, renderResult) {
    let tootResult = null;
    if (renderResult.rendered) {
      tootResult = await this.mastodon.toot(headline.text, renderResult.path);
    } else {
      tootResult = await this.mastodon.toot(headline.text);
    }
    console.log(`Tooted: ${tootResult.data.uri}`);
    return tootResult.data.uri;
  }

  async discordMessage(message) {
    console.log(`Sending to ${this.options.debug ? `DEBUG` : `NORMAL`} discord: "${message}"`);
    if (this.options.debug)
      Discord.sendDebug(message);
    else
      Discord.sendText(message);
  }

  async processHeadline(headline) {
    const NUM_TWEET_ATTEMPTS = 5;

    const exceptions = [];

    let postedMessage = headline.text;
    console.log(`\n* ${headline.text}`);
    const outputPath = `${config.paths.tempDirectory}/${MtgNewsbot.createFileName(headline)}.png`;
    const renderResult = await RenderImage.fromHeadline(headline, outputPath);
    if (renderResult.rendered) {
      console.log("Render result: " + renderResult.msg);
    }

    // Mastodon
    if (this.options.toot && !this.options.debug) {
      try {
        postedMessage = await this.toot(headline, renderResult);
      } catch (e) {
        exceptions.push(new Error(`Mastadon toot failed: ${e}`));
      }
    }

    // Twitter
    if (this.options.tweet && !this.options.debug) {
      let timeoutSeconds = 10;
      for (let iterations = NUM_TWEET_ATTEMPTS; iterations > 0; --iterations) {
        try {
          let tweetResult = await this.tweet(headline, renderResult);
          postedMessage = tweetResult;
          break;        
        } catch (e) {
          if (iterations > 1) {
            console.warn(` -> Tweet failed. Waiting ${timeoutSeconds} seconds to retry tweet...`);
            await this.wait(timeoutSeconds);
            timeoutSeconds *= 2;
          }
          else {
            exceptions.push(new Error(`Tweet failed after ${NUM_TWEET_ATTEMPTS} attempts. ${e}`));
          }
        }
      }
    }

    if (exceptions.length > 1) {
      throw new Error(exceptions.reduce(
        (message, exception, index) => `${message}\n\n${index+1}) ${exception}`,
        `Encountered multiple failures while posting headline:`
      ));
    } else if (exceptions.length === 1) {
      throw exceptions[0];
    }

    // Discord
    if (this.options.discord) {
      await this.discordMessage(postedMessage);
    }

    return Promise.resolve(postedMessage);
  }
}

module.exports = MtgNewsbot;
