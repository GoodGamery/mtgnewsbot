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
  return randomElement(cardData);
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

function traceryEscape(string) {
  return string.replace(/:/g,'#colon#').replace(/,/g,"#comma#");
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
          console.warn('No results returned from card search. Fetching random card.');
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
    const card = result[0];

    const name = traceryEscape(card.name);
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

    return ''.concat(
      `[_cardName1:${name}]`,
      `[_cardSet1:${set}]`,
      `[_cardRarity1:${rarity}]`,      
      `[_cardType1:${type}]`,     
      `[_cardSubtype1:${subtype}]`,
      `[_cardFullType1:${fullType}]`,
      `[_cardFullSubtype1:${fullSubtype}]`,
      `[_cardSomeTypeOrSubtype1:${someTypeOrSubtype}]`,                              
      `[_cardImgUrl1:${imgUrl}]`,
      `[_cardColor1:${color}]`,
      `[_cardDescriptive1:${colorDescriptive}]`,
      `[_cardColorClass1:${colorClass}]`,
      `[_cardSomeColor1:${someColor}]`      
    );
  } catch (e) {
    logger.warn(e);
    return 'SEARCH_FAILED_NO_RESULT';
  }
}

module.exports = {
  cardSearchBySet,
  cardSearchByText,
  cardSearchByType,
  randomStaticCard  
};