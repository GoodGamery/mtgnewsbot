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
      this.twit.post('statuses/update', { status: tweet }, (err, data, response) => {
        if (!err) {
          console.log('tweet posted.');
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }

  postImageTweet(data, altText, message) {
    return new Promise((resolve, reject) => {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string;
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      console.log('setting media metadata');

      this.twit.post('media/metadata/create', meta_params, (err, data, response) => {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: message, media_ids: [mediaIdStr] }

          console.log('posting tweet...');

          this.twit.post('statuses/update', params, (err, data, response) => {
            resolve();
          });
        } else {
          reject(err);
        }
      });
    });
  }

  uploadTwitterImage(filepath) {
    return new Promise((resolve, reject) => {
      try {
        var b64content = fs.readFileSync(filepath, { encoding: 'base64' });

        console.log('uploading image file to twitter...');

        this.twit.post('media/upload', { media_data: b64content }, function (err, data, response) {
          if (!err) { 
            console.log(' image uploaded.');            
            resolve(data);
          } else {
            reject(err);
          }
        });          
      } catch(e) {
        reject(e);
      }
     });
  }  
}

module.exports = TwitterClient;



