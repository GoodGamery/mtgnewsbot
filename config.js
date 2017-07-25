'use strict';
const merge = require('lodash.merge');
const buildGrammar = require('./src/build-grammar.js');

const CONFIG_OVERRIDE_PATH = './config-override.js';
const LOCAL_CONFIG_OVERRIDE_PATH = './local-config-override.js';
const DEFAULT_GRAMMAR_PATH = './src/data/grammar';
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
let override = {};
try { 
  override = require(CONFIG_OVERRIDE_PATH); 
  console.log('Reading server config overrides.');
} catch(e) {  console.warn('Server override not loaded: ' + e.message); }

let localOverride = {};
try { 
  localOverride = require(LOCAL_CONFIG_OVERRIDE_PATH); 
  console.log('Reading local config overrides.');
} catch(e) {  console.warn('Local override not loaded: ' + e.message); }

config = merge(config, override);
config = merge(config, localOverride);

console.log('CONFIG:');
console.log(JSON.stringify(config));

// load the default grammar after applying overrides
config.defaultGrammar = buildGrammar(config.defaultGrammarPath);

config = Object.freeze(config);

global.mtgnewsbot = global.mtgnewsbot || {};
global.mtgnewsbot.config = config;

module.exports = config;