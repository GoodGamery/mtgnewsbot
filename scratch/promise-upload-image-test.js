const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const Twit = require('twit');

function lazyGuid() {
  return  Math.round(Math.random() * 100000000) + '-' + Math.round(Math.random() * 100000000);
}

const cardFinderUrl = 'https://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img=true&find=';
const cardname = 'Kookus';
const imgurl = cardFinderUrl + cardname;
const outputfile = cardname.replace(/\s/g, '-').toLowerCase() + '-' + lazyGuid() + '.jpg';
const outputDir = 'logs';
const outputPath = outputDir + '/' + outputfile;
    
var T = new Twit(
    { consumer_key:         process.env.TWITTER_CONSUMER_KEY
    , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
    , access_token:         process.env.TWITTER_ACCESS_TOKEN
    , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
);

function uploadTwitterImage(filepath) {
   return new Promise((resolve, reject) => {
      try {
        var b64content = fs.readFileSync(filepath, { encoding: 'base64' });

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

function postImageTweet(filepath, altText, message) {
  return new Promise((resolve, reject) => {
    // first we must post the media to Twitter
    uploadTwitterImage(filepath)
      .then(data =>{ 
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string;
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: message, media_ids: [mediaIdStr] }

            T.post('statuses/update', params, function (err, data, response) {
              console.log(data);
              resolve();
            });
          } else {
            reject(err);
          }
        });
      });
  });  
}

https.request(imgurl, function(response) {                                        
  var data = new Stream();                                                    

  response.on('data', function(chunk) {                                       
    data.push(chunk);                                                         
  });                                                                         

  response.on('end', function() {                                             
    fs.writeFileSync(outputPath, data.read());
    postImageTweet(outputPath, cardname, 'The card you\'re thinking of is ' +  cardname)
      .then(() => { console.log('Posted to twitter.') }, e => { console.err('Failed to post to twitter: ' + e); })
      .then(() => {
        fs.unlink(outputPath, (err) => {
        if (err) throw err;
          console.log('Deleted ' + outputPath);
        });   
      });
  });

  response.on('error', function(e) {                                             
    console.log('Failed to download image: ' + e);                         
  });       

}).end();

