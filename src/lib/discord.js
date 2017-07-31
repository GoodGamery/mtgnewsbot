// Util for posting to a webhook
'use strict';
const request = require('request');
const config = require('../config');

function sendWebhookText(text) {
  executeWebhook({ content: text });
}

function sendWebhookEmbed(headlineText, url, imgUrl, imgHeight, imgWidth) {
  const payload = {
    content: headlineText,
    embeds: [{
      title: `MTG Newsbot`,
      url: url,
      description: headlineText,
      image: {
        url: imgUrl,
        height: imgHeight,
        width: imgWidth
      }
    }]
  };
  executeWebhook(payload);
}

function executeWebhook(payload) {
  // Silently fail if the webook url isn't registered
  if (!config.webookUrl)
    return;

  request.post(
    config.webookUrl,
    { json: payload },
    handleResponse
  );
}

function handleResponse(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    } else {
      console.error(error);
    }
}

module.exports = {
  sendText: sendWebhookText,
  sendEmbed: sendWebhookEmbed
};
