'use strict';
const merge = require('lodash.merge');

const CONFIG_OVERRIDE_PATH = './config-override.js';

const DEFAULT_GRAMMAR_PATH = './src/data/grammar.json';
const TWEET_LENGTH = 140;
const TEMPFILE_PATH = '/tmp';
const LOGFILE_PATH = `./debug.log`;

let config = {
	defaultGrammarPath:  DEFAULT_GRAMMAR_PATH,
	defaultGrammar: undefined,
	tweetLength: TWEET_LENGTH,
	paths: {
		tempDirectory: TEMPFILE_PATH,
		logFile: LOGFILE_PATH
	}
};

// apply overrides from config overrides file
let override;
try { override = require(CONFIG_OVERRIDE_PATH); } catch(e) { console.log('override file not found: ' + e); }
config = merge(config, override);

// load the default grammar after applying overrides
config.defaultGrammar = require(config.defaultGrammarPath);

config = Object.freeze(config);

global.mtgnewsbot = global.mtgnewsbot || {};
global.mtgnewsbot.config = config;

module.exports =config;