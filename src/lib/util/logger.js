'use strict';

const config = global.mtgnewsbot.config;

class Logger {

  constructor(name) {
    this.name = name;
  }

  log(message) {
    if (config.logPrefs[this.name]) {
      console.log(message);
    }
  }

  warn(message) {
    if (config.logPrefs[this.name]) {
      console.warn(message);
    }
  }

  error(message) {
    if (config.logPrefs[this.name]) {
      console.error(message);
    }
  }
}

module.exports = Logger;