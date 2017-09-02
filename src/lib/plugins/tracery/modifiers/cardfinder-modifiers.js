'use strict';
const request = require('request');
const config = global.mtgnewsbot.config;
const readJsonFile = require('../../../util/read-json-file.js');
const staticCardDataFile = './src/data/cards/example-cards.json';

const logger = config.loggers.cardfinder;

function randomElement(array) {
  return array && array[Math.floor(Math.random() * array.length)];
}

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

function getColorDescription(colorIdentity) {
  if (!colorIdentity) {
    return 'colorless';
  } else if (colorIdentity.length == 5) {
    return 'WUBRG';
  }

  const colorDescription = colorIdentity.join('');
  return colorNames[colorDescription] || colorDescription;
}

function getColorFullDescription(colorIdentity) {
  if (!colorIdentity) {
    return 'colorless';
  }

  return colorIdentity.map(color => colorNames[color]).join('-');
}

function getColorCategory(colorIdentity) {
  if (!colorIdentity) {
    return 'colorless';
  }

  if (colorIdentity.length === 1) {
    return colorNames[colorIdentity[0]];
  } else {
    return 'multicolored';
  }
}

function getSomeColor(colorIdentity) {
  if (!colorIdentity) {
    return 'colorless';
  }

  return colorNames[randomElement(colorIdentity)];
}


function getSomeCardTypeOrSubtype(types, subtypes) {
  const typesAndSubtypes = types.concat(subtypes ? subtypes : []);
  return randomElement(typesAndSubtypes);
}

async function randomCards(limit) {
    logger.log(`Finding ${limit} random cards`);

  const query = { 
    q: 'cmc >= 0',
    limit: limit || 1,
    sort: 'random'
  };
  return searchCardFinder(query);
}

function randomStaticCards(limit) {
  const cardData = readJsonFile(staticCardDataFile);
  const cards = [];
  for (let i = 0; i < limit || 1; i++) {
    cards.push(randomElement(cardData));
  }
  return cards;
}

async function cardSearchRandom(undefined, params) {
  const query = { 
    q: 'cmc >= 0'
  };
  return cardFinderSearch(query, params);    
}

async function cardSearchBySet(s, params) {
  const query = { 
    q: 'set:' + s
  };
  return cardFinderSearch(query, params);    
}

async function cardSearchByText(s, params) {
  const query = { 
    q: 'text:' + s
  };
  return cardFinderSearch(query, params);  
}

async function cardSearchByType(s, params) {
  const query = { 
    q: 't:' + s
  };
  return cardFinderSearch(query, params);
}

async function searchCardFinder(query) {
  const SEARCH_API_JSON_URL = 'https://goodgamery.com/api/mtg/card/json';

  return new Promise((resolve, reject) => {
    request.get({ url: SEARCH_API_JSON_URL, qs: query }, (err, data, body) => {
      logger.log('REQUEST DATA '); logger.log(JSON.stringify(data));

      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function traceryEscape(string) {
  return string.replace(/:/g,'#colon#').replace(/,/g,"#comma#");
}

async function cardFinderSearch(query, params) {
  let resultData;
  let result;
  let queryLimit = 1;

  if (params.length > 0) {
    if (parseInt(params[0]) > 0) {
      queryLimit = parseInt(params[0]);
    } else {
      logger.warn(`Invalid query limit specified for query ${JSON.stringify(query)}: '${params[0]}' is not a valid positive integer.`);
    }
  }

  query.limit = queryLimit;
  query.sort = 'random';

  logger.log(`Searching for ${queryLimit} cards.`);
  try {
    try {      
      resultData = await searchCardFinder(query);
      try {
        result = JSON.parse(resultData);     
        logger.log('Retrieved ' + result.length + ' cards.');

        if (result.length < queryLimit) {          
          logger.warn(`Zero or insufficient results returned from card search: expected ${queryLimit} but received ${result.length}.`);
          logger.warn('Fetching random cards.');

          resultData = await randomCards(queryLimit - result.length);
          logger.log('Retrieved ' + JSON.parse(resultData).length + ' addtional cards.');

          result = result.concat(JSON.parse(resultData));
        }
      } catch (e) {
        throw new Error('Error parsing card data: ' + e);    
      }        
    } catch (e) {
      throw new Error('Failed to fetch card data: ' + e);
    }      
  } catch (e) {
    logger.warn(e);    
    result = [randomStaticCards(queryLimit)];
  }
   
  logger.log('Result: ' + JSON.stringify(result));
  logger.log('Total cards: ' + result.length);

  try {    
    let finalResult = '';
    for (let i = 1; i <= queryLimit; i++) {
      const card = result[i - 1];

      const rawName = traceryEscape(card.name);

      let name = rawName;
      const set = traceryEscape(card.set);
      const rarity = traceryEscape(card.rarity);      
      const type = randomElement(card.types);
      const subtype = randomElement(card.subtypes);
      const fullType = card.types.join(' ');
      const fullSubtype = card.subtypes && card.types.join(' ');    
      const someTypeOrSubtype = getSomeCardTypeOrSubtype(card.types, card.subtypes);
      const imgUrl = traceryEscape(card.imageUrl);
      const color = getColorDescription(card.colorIdentity);
      const colorDescriptive = getColorFullDescription(card.colorIdentity);
      const colorClass = getColorCategory(card.colorIdentity);    
      const someColor = getSomeColor(card.colorIdentity);

      if (card.layout === 'token') {
        name += ' Token';
      } else if (card.layout === 'vanguard') {
        name += ' Avatar';
      }

      finalResult = finalResult.concat(
        `[_cardName${i}:${name}]`,
        `[_cardRawName${i}:${name}]`,
        `[_cardSet${i}:${set}]`,
        `[_cardRarity${i}:${rarity}]`,      
        `[_cardType${i}:${type}]`,     
        `[_cardSubtype${i}:${subtype}]`,
        `[_cardFullType${i}:${fullType}]`,
        `[_cardFullSubtype${i}:${fullSubtype}]`,
        `[_cardSomeTypeOrSubtype${i}:${someTypeOrSubtype}]`,                              
        `[_cardImgUrl${i}:${imgUrl}]`,
        `[_cardColor${i}:${color}]`,
        `[_cardDescriptive${i}:${colorDescriptive}]`,
        `[_cardColorClass${i}:${colorClass}]`,
        `[_cardSomeColor${i}:${someColor}]`      
      );
    }

    logger.log('Constructed cardsearch result: ' + finalResult);
    return finalResult;
  } catch (e) {
    logger.warn(e);
    return 'SEARCH_FAILED_NO_RESULT';
  }
 
}

module.exports = {
  cardSearchBySet,
  cardSearchByText,
  cardSearchByType,
  randomCard:   () => cardSearchRandom(undefined, 1),
  randomCards:  cardSearchRandom
};