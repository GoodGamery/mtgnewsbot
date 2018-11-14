'use strict';
const path = require('path')
const merge = require('lodash.merge');
const Logger = require('./src/lib/util/logger');

const DEFAULT_OVERRIDE_PATH = './config-override.json';
const DEFAULT_GRAMMAR_PATH = './src/data/grammar';
const TWEET_LENGTH = 280;
const TEMPFILE_PATH = '/tmp';

class Config {
	constructor(overridePath=DEFAULT_OVERRIDE_PATH) {

		let base = {
		  defaultGrammarPath:  DEFAULT_GRAMMAR_PATH,
		  debugOptions: {
		    deleteTempImages: true
		  },  
		  loggers: { },
		  logPrefs:  { cardfinder: true, html: true, svg: true, scryfall: true },
		  origin: undefined,
		  tweetLength: TWEET_LENGTH,
		  paths: {
		    tempDirectory: TEMPFILE_PATH
		  },
		  twitterLink: `https://twitter.com/MTGnewsbot`,
		  webhookUrl: null,
		  webhookUrlErr: null,
		  TWITTER_CONSUMER_KEY: null,
		  TWITTER_CONSUMER_SECRET: null,
		  TWITTER_ACCESS_TOKEN: null,
		  TWITTER_ACCESS_TOKEN_SECRET: null,
		  MASTODON_API_TOKEN: null,
		  MASTODON_API_URL: null
		};

		merge(this, base);
		// apply overrides from config overrides file
		try {
		  let override = require(path.resolve('.', overridePath));
		  console.info(`Loading config overrides from ${overridePath}`);
			merge(this, override);		  
		} catch(e) {
		  if (e.code === 'MODULE_NOT_FOUND') { 
		    console.info(`No config override found at ${overridePath}`);
		  } else {
		    console.warn(`Unable to load config override: ${e}`);
		  }
		}

		// create loggers and enable or disable based on preferences
		const loggers = {
			cardfinder: new Logger('cardfinder', this.logPrefs.cardfinder),
			html: new Logger('html', this.logPrefs.html),
			svg: new Logger('svg', this.logPrefs.svg),
			scryfall: new Logger('scryfall', this.logPrefs.scryfall)
		};

		merge(this, { loggers: loggers });

		Object.freeze(this);
	}
}

module.exports = Config;
