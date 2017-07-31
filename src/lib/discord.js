// Util for posting to a webhook
'use strict';
const request = require('request');
const config = require('../../config');

function sendText(text) {
  executeWebhook({ content: text });
}

function sendEmbed(headlineText, url, imgUrl, imgHeight, imgWidth) {
  let payload = {
    content: headlineText,
    embeds: [{
      title: `MTG Newsbot`,
      description: headlineText,
    }]
  };
  if (url) {
    payload.embeds[0].url = url;
  }
  if (imgUrl) {
    payload.embeds[0].image = {
        url: imgUrl,
        height: imgHeight,
        width: imgWidth
      };
  }
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
  sendText: sendText,
  sendEmbed: sendEmbed
};
