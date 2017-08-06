'use strict';

const Twit = require('twit');
const fs = require('fs');

class TwitterClient {
  constructor(config) {
    const twitterConfig = {
      consumer_key: config.TWITTER_CONSUMER_KEY,
      consumer_secret: config.TWITTER_CONSUMER_SECRET,
      access_token: config.TWITTER_ACCESS_TOKEN,
      access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
    };
    this.twit = new Twit(twitterConfig);
  }

  postTweet(message, imagePath, altText) {
    if (imagePath) {
      const postTheTweet = this.postImageTweet.bind(this, message, altText);
      return this.uploadTwitterImage(imagePath)
        .then(postTheTweet);
    }
    // Plain text tweet
    return this.postTextTweet(message);
  }

  postTextTweet(message) {
    return new Promise((resolve, reject) => {
      console.log('posting tweet...');
      try {
        this.twit.post('statuses/update', { status: message }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            console.log('tweet posted.');
            resolve(data);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  postImageTweet(message, altText, data) {
    return new Promise((resolve, reject) => {
      try {
        const mediaIdStr = data.media_id_string;

        const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        console.log('setting media metadata');

        this.twit.post('media/metadata/create', meta_params, (err) => {
          if (err) {
            reject(err);
          } else {
            let params = { status: message, media_ids: [mediaIdStr] };

            console.log('posting tweet...');

            this.twit.post('statuses/update', params, (err, data) => {
              resolve(data);
            });
          }
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
            reject(err);
          } else {
            console.log(' image uploaded.');
            resolve(data);
          }
        });
      } catch(e) {
        reject(e);
      }
     });
  }
}

module.exports = TwitterClient;