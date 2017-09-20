// Mastodon is like twitter, but you toot instead of tweet, and the character limit is 500 instead of 140.
'use strict';
const Masto = require('mastodon-api');
const fs = require('fs');

class MastodonClient {
  constructor(config) {
    this.mastodon = new Masto({
      access_token: config.MASTODON_API_TOKEN,
      timeout_ms: 15*1000,
      api_url: config.MASTODON_API_URL
    });
  }

  async toot(text, mediaPath) {
    if (mediaPath) {
      let resp = await this.mastodon.post('media', { file: fs.createReadStream(mediaPath) });
      let mediaId = resp.data.id;
      return this.mastodon.post('statuses', { status: `${text}`, media_ids: [mediaId] });
    } else {
      return this.mastodon.post('statuses', { status: `${text}` });
    }
  }
}

module.exports = MastodonClient;
