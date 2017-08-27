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
}

module.exports = Logger;