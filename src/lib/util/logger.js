'use strict';

const logPreferences = {};

class Logger {
  constructor(name, enabled) {
    this.name = name;
    logPreferences[name] = enabled === false ? false : true;
  }

  log(message) {
    if (logPreferences[this.name]) {
      console.log(message);
    }
  }

  warn(message) {
    if (logPreferences[this.name]) {
      console.warn(message);
    }
  }

  error(message) {
    if (logPreferences[this.name]) {
      console.error(message);
    }
  }
}

module.exports = Logger;