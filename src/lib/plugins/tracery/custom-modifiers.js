'use strict';
const request = require('request');

function allCaps(s) {
  return s.toUpperCase();
}

function noPunctuation(s) {
  return s.replace(/[()',"-:[\].?!:;=+_&*%^`~{}\\/|]/g, '');
}

function noSpaces(s) {
  return s.replace(/\s+/g, '');
}

function hyphenate(s) {
  return s.replace(/\s+/g, '-');
}

async function cardSearchByType(s) {
  
  const SEARCH_API_JSON_URL = 'https://goodgamery.com/api/mtg/card/json';
  
  const query = { 
    q: 't:' + s,
    limit: 1,
    sort: 'random'
  };

  console.log('[cardSearchByType] searching for card with type ' + s);

  return new Promise(resolve => {
    request.get({ url: SEARCH_API_JSON_URL, qs: query }, (err, data, body) => {
      if (err) {
        console.warn('Error fetching card data: ' + err);        
        resolve('NO RESULTS');
      }

      try {
        // console.log('[cardSearchByType] response:\n' + JSON.stringify(data));
        // console.log('[cardSearchByType] body:\n' + JSON.stringify(body));
        const result = JSON.parse(body);
        const name = result[0].name;
        const imgUrl = result[0].imageUrl.replace(/:/g,'#colon#');

        console.log('name: ' + name);
        console.log('imageUrl: ' + imgUrl);
        resolve(`[_cardName1:${name}][_cardImgUrl1:${imgUrl}]`);
      } catch (e) {
        console.warn('Error parsing card data: ' + e);
        resolve('NO RESULTS');
      }
    });
  });
}

module.exports = { 
  allCaps: allCaps,
  hyphenate: hyphenate,
  noPunctuation: noPunctuation,
  noSpaces: noSpaces,
  cardSearchByType: cardSearchByType
};