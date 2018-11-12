'use strict';

const https = require('https');
const Stream = require('stream').Transform;
const config = global.mtgnewsbot.config;
const logger = config.loggers.scryfall;

const SCRYFALL_REQUEST_URL = 'https://api.scryfall.com/cards/random';
const SCRYFALL_REQUEST_URL_NORMAL_CARDS =  'https://api.scryfall.com/cards/random?q=-type%3Ascheme%20-type%3Aplane%20-st:set_promo'

function getRandomCard() {
  return new Promise((resolve, reject) => {
    try {
      logger.log('Getting random card from ' + SCRYFALL_REQUEST_URL_NORMAL_CARDS);

      https.request(SCRYFALL_REQUEST_URL_NORMAL_CARDS, function(response) {
        let data = new Stream();

        response.on('data', function(chunk) {
          data.push(chunk);
        });

        response.on('end', function() {
					const jsonResponse = JSON.parse(data.read());
					logger.log('JSON response: ' + JSON.stringify(jsonResponse));
          resolve(jsonResponse);
        });

        response.on('error', function(e) {
          throw e;
        });
      }).end();
    } catch(e) {
      reject(e);
    }
  });
}

function randomScryfallCard() {
	return getRandomCard().then(card => {
		const result = `[_cardName1:${card.name.replace(/,/g, "#comma#")}][_imgUrl1:${card.image_uris.normal.replace(/:/g, "#colon#")}][_borderColor1:${card.border_color}]`;
		logger.log('Found card: ' + result);
		return result;
	});
}
module.exports = { randomScryfallCard: randomScryfallCard };