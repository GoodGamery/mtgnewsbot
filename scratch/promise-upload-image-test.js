const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const Twit = require('twit');

function lazyGuid() {
  return  Math.round(Math.random() * 100000000) + '-' + Math.round(Math.random() * 100000000);
}

const cardFinderUrl = 'https://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img=true&find=';
const cardname = 'Three Visits';
const outputfile = cardname.replace(/\s+/g, '-').toLowerCase() + '-' + lazyGuid() + '.jpg';
const outputDir = 'logs';
const outputPath = outputDir + '/' + outputfile;
    
var T = new Twit(
    { consumer_key:         process.env.TWITTER_CONSUMER_KEY
    , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
    , access_token:         process.env.TWITTER_ACCESS_TOKEN
    , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
);

function downloadMtgCardFinderImage(cardname, outputPath) {
  return new Promise((resolve, reject) => {  
    const imgurl = cardFinderUrl + cardname;    
    try {
      console.log('Downloading image data from ' + imgurl);
      https.request(imgurl, function(response) {                                        
        var data = new Stream();

        response.on('data', function(chunk) {                                       
          data.push(chunk);                                                         
        });                                                                         

        response.on('end', function() {
          console.log('Writing image data file...');

          fs.writeFileSync(outputPath, data.read());
          console.log('Wrote image date to ' + outputPath);

          resolve(outputPath);        
        });

        response.on('error', function(e) {                                             
          reject(e);                         
        });
      }).end();
    } catch(e) {
      reject(e);
    }
  });
}

function uploadTwitterImage(filepath) {
   return new Promise((resolve, reject) => {
      try {
        var b64content = fs.readFileSync(filepath, { encoding: 'base64' });

        console.log('Uploading image file to twitter...');

        T.post('media/upload', { media_data: b64content }, function (err, data, response) {
          if (!err) { 
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

function postImageTweet(data, altText, message) {
  return new Promise((resolve, reject) => {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    console.log('Setting media metadata...');

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: message, media_ids: [mediaIdStr] }

        console.log('Posting tweet...');

        T.post('statuses/update', params, function (err, data, response) {
          console.log(data);
          resolve();
        });
      } else {
        reject(err);
      }
    });
  });  
}

downloadMtgCardFinderImage(cardname, outputPath)
  .then(localFilePath => uploadTwitterImage(localFilePath), e => console.error('Failed to upload image: ' + e))
  .then(twitterImage => {
    return postImageTweet(twitterImage, cardname, 'The card you\'re thinking of is ' +  cardname)
      .then(() => { 
        console.log('Posted tweet.'); 
      }, e => console.error('Failed to post tweet: ' + e))
      .then(() => {
        return fs.unlink(outputPath, (err) => {
          if (!err) { 
            console.log('Deleted ' + outputPath);           
          } else {
            console.error('Unable to delete local image file: ' + err);            
          }
        });   
      });    
  }, e => console.error('Failed to download image: ' + e));