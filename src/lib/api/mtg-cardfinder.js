'use strict';

const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');

const CARDFINDER_REQUEST_URL = 'https://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img=true&find=';

function downloadCardImage(cardname, outputPath) {
  return new Promise((resolve, reject) => {  
    const imgurl = CARDFINDER_REQUEST_URL + cardname;
    try {
      console.log('Downloading image data from ' + imgurl);
      https.request(imgurl, function(response) {                                        
        let data = new Stream();

        response.on('data', function(chunk) {                                       
          data.push(chunk);                                                         
        });                                                                         

        response.on('end', function() {
          console.log('writing image data file...');

          fs.writeFileSync(outputPath, data.read());
          console.log('wrote image date to ' + outputPath);

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

module.exports = { downloadCardImage: downloadCardImage };