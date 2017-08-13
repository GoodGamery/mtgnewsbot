'use strict';

function pathToFileUrl(str) {
  var path = require('path');
  if (typeof str !== 'string') {
      throw new Error('Expected a string');
  }

  var pathName = path.resolve(str).replace(/\\/g, '/');

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
      pathName = '/' + pathName;
  }

  return encodeURI('file://' + pathName);
}

module.exports = pathToFileUrl;