'use strict';

const Twit = require('twit');
const fs = require('fs');

const TWIT_CONFIG =  {
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
};

class TwitterClient {
  constructor() {
    this.twit = new Twit(TWIT_CONFIG);
  }

  postTweet(message) {
    return new Promise((resolve, reject) => {
      console.log('posting tweet...');
      try {
        this.twit.post('statuses/update', { status: message }, (err, data) => {
          if (err) {
            throw(err);
          }
          console.log('tweet posted.');
          resolve(data);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  postImageTweet(data, altText, message) {
    return new Promise((resolve, reject) => {
      try {
        let mediaIdStr = data.media_id_string;

        let meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        console.log('setting media metadata');

        this.twit.post('media/metadata/create', meta_params, (err) => {
          if (err) {
            throw err;
          }
          let params = { status: message, media_ids: [mediaIdStr] };

          console.log('posting tweet...');

          this.twit.post('statuses/update', params, () => {
            resolve();
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  uploadTwitterImage(filepath) {
    return new Promise((resolve, reject) => {
      try {
        console.log('uploading image file to twitter...');
        
        let base64Data = fs.readFileSync(filepath, { encoding: 'base64' });
        this.uploadTwitterImageData(base64Data).then(data => {
          resolve(data);
        });
      } catch(e) {
        reject(e);
      }
     });
  }

  uploadTwitterImageData(base64Data) {
    return new Promise((resolve, reject) => {
      try {
        console.log('uploading image data to twitter...');

        this.twit.post('media/upload', { media_data: base64Data }, function (err, data) {
          if (err) {
            throw err;
          }
          console.log(' image uploaded.');
          resolve(data);
        });
      } catch(e) {
        reject(e);
      }
     });
  }
}

module.exports = TwitterClient;