'use strict';
const merge = require('lodash.merge');
const Logger = require('./src/lib/util/logger');

const CONFIG_OVERRIDE_PATH = './config-override.json';
const DEFAULT_GRAMMAR_PATH = './src/data/grammar';
const TWEET_LENGTH = 280;
const TEMPFILE_PATH = '/tmp';

let config = {
  defaultGrammarPath:  DEFAULT_GRAMMAR_PATH,
  debugOptions: {
    deleteTempImages: true
  },  
  loggers: { },
  logPrefs:  { cardfinder: true, html: true, svg: true },
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

const submodules = {
  tracery: require('./submodules/tracery')
};

// apply overrides from config overrides file
try {
  let override = require(CONFIG_OVERRIDE_PATH);
  console.info(`Loading config overrides from ${CONFIG_OVERRIDE_PATH}`);
  config = merge(config, override);
} catch(e) {
  if (e.code === 'MODULE_NOT_FOUND') { 
    console.info(`No config overrides located at ${CONFIG_OVERRIDE_PATH}`);
  } else {
    console.warn(`Unable to load config override: ${e}`);
  }
}

// create loggers and enable or disable based on preferences
config.loggers.cardfinder  = new Logger('cardfinder', config.logPrefs.cardfinder);
config.loggers.html        = new Logger('html', config.logPrefs.html);
config.loggers.svg        = new Logger('svg', config.logPrefs.svg);

Object.freeze(config);

global.mtgnewsbot = global.mtgnewsbot || {};
global.mtgnewsbot.config = config;
global.submodules = submodules;

module.exports = config;
