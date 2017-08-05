// Util for posting to a webhook
'use strict';
const request = require('request');
const config = require('../../config');
const COLOR_RED = 14370336;
const COLOR_BLUE = 4347636;

// Sends a simple text message to the Discord channel
function sendText(text) {
  executeWebhook({ content: text });
}

// Sends a content embed to the Discord channel
function sendEmbed(text, url, imgUrl, imgHeight, imgWidth) {
  let payload = {
    content: ``,
    embeds: [{
      title: `The Latest News`,
      description: text,
      color: COLOR_BLUE
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

// Sends an error message to the error Discord channel
function sendError(text) {
  let payload = {
    content: `The bot had an error:`,
    embeds: [{
      title: `ERROR`,
      description: text,
      color: COLOR_RED
    }]
  };
  executeWebhook(payload, true);
}

// Sends an debug message to the error Discord channel
function sendDebug(text) {
  let payload = {
    content: `The bot is sending a debug message:`,
    embeds: [{
      title: `DEBUG`,
      description: text,
      color: COLOR_BLUE
    }]
  };
  executeWebhook(payload, true);
}

function executeWebhook(payload, isError) {
  const url = isError ? config.webhookUrlErr : config.webhookUrl;
  
  // Silently fail if the webhook url isn't registered
  if (!url)
    return;

  request.post(url, { json: payload }, handleResponse);
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
  sendEmbed: sendEmbed,
  sendError: sendError,
  sendDebug: sendDebug
};
