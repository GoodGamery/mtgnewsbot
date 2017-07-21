'use strict';
const merge = require('lodash.merge');
const buildGrammar = require('./src/build-grammar.js');

const CONFIG_OVERRIDE_PATH = './config-override.js';
const DEFAULT_GRAMMAR_PATH = './src/data/';
const TWEET_LENGTH = 140;
const TEMPFILE_PATH = '/tmp';
const LOGFILE_PATH = './debug.log';

let config = {
	defaultGrammarPath:  DEFAULT_GRAMMAR_PATH,
	defaultGrammar: undefined,
	origin: undefined,
	tweetLength: TWEET_LENGTH,
	paths: {
		tempDirectory: TEMPFILE_PATH,
		logFile: LOGFILE_PATH
	}
};

// apply overrides from config overrides file
let override;
try { 
  override = require(CONFIG_OVERRIDE_PATH); 
  console.info('Applying config overrides.');
} catch(e) { 
  /* use default config */ 
}
config = merge(config, override);

// load the default grammar after applying overrides
config.defaultGrammar = buildGrammar(config.defaultGrammarPath);

config = Object.freeze(config);

global.mtgnewsbot = global.mtgnewsbot || {};
global.mtgnewsbot.config = config;

module.exports = config;