// Utility for rendering html images to files
const webshot = require('webshot');
const Jimp = require('jimp');
const fs =  require(`fs`);

const webshotOptions = {
  windowSize: { width: 1024, height: 768 }
, shotSize: { width: 1024, height: 'all' }
, phantomPath: 'phantomjs'
, siteType: 'html'
, streamType:	'png'
, renderDelay: 0
};

function renderImageFromHtml(html, outputPath) {
  return new Promise((resolve, reject) => {
    const tempFile = `${outputPath}.tmp.png`;

    webshot(html, tempFile, webshotOptions, (err) => {
      if (err) {
        console.error(`WEBSHOT ERROR: ${err}`);
        reject(err);
        return;
      }

      Jimp.read(tempFile)
        .then(image => image.autocrop().write(outputPath))
        .then(() => {
          setTimeout(() => resolve(outputPath), 50);
        })
        .then(() => fs.unlink(tempFile, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
        }))
        .catch(err => {
          console.error('\n *** Failed to create trimmed png:');
          console.error(err.stack);
          reject(err);
        });
    });
  });
}

module.exports = {
  fromHtml: renderImageFromHtml
}
