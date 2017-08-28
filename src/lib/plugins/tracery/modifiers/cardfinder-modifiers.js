'use strict';
const request = require('request');
const config = global.mtgnewsbot.config;
const readJsonFile = require('../../../util/read-json-file.js');
const staticCardDataFile = './src/data/cards/example-cards.json';

const logger = config.loggers.cardfinder;

function getColorDescription(colorIdentity) {
  const colorNames = {
    W: 'white',
    U: 'blue',
    B: 'black',
    R: 'red',
    G: 'green',
    WU: 'UW',
    WR: 'RW',
    WG: 'GW',
    BR: 'RB',
    UBG: 'BUG',
    URG: 'RUG'
  };

  if (!colorIdentity) {
    return 'colorless';
  }

  const colorDescription = colorIdentity.join('');
  return colorNames[colorDescription] || colorDescription;
}

async function randomCard() {
  const query = { 
    q: 'cmc >= 0',
    limit: 1,
    sort: 'random'
  };
  return searchCardFinder(query);
}

function randomStaticCard() {
  const cardData = readJsonFile(staticCardDataFile);
  return cardData[Math.floor(Math.random() * cardData.length)];
}

async function cardSearchBySet(s) {
  const query = { 
    q: 'set:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);    
}

async function cardSearchByText(s) {
  const query = { 
    q: 'text:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);  
}

async function cardSearchByType(s) {  
  const query = { 
    q: 't:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);
}

async function searchCardFinder(query) {
  const SEARCH_API_JSON_URL = 'https://goodgamery.com/api/mtg/card/json';

  return new Promise((resolve, reject) => {
    request.get({ url: SEARCH_API_JSON_URL, qs: query }, (err, data, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

async function cardFinderSearch(query) {
  let resultData;
  let result;
  try {
    try {
     resultData = await searchCardFinder(query);
      try {
        result = JSON.parse(resultData);     
        if (result.length === 0) {
          console.warn('No results returned from card search. Fetching random card.')
          resultData = await randomCard();
          result = JSON.parse(resultData);
        }
      } catch (e) {
        throw new Error('Error parsing card data: ' + e);    
      }        
    } catch (e) {
      throw new Error('Failed to fetch card data: ' + e);
    }      
  } catch (e) {
    logger.warn(e);    
    result = [randomStaticCard()];
  }
    
  try {
    const name = result[0].name;
    const imgUrl = result[0].imageUrl.replace(/:/g,'#colon#');
    const color = getColorDescription(result[0].colorIdentity);

    return `[_cardName1:${name}][_cardImgUrl1:${imgUrl}][_cardColor1:${color}]`;
  } catch (e) {
    return 'SEARCH_FAILED_NO_RESULT';
  }
}

module.exports = {
  cardSearchBySet,
  cardSearchByText,
  cardSearchByType,
  randomStaticCard  
};