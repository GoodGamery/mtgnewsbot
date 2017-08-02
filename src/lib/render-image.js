// Utility for rendering html images to files
'use strict';
const webshot = require('webshot');
const svg2png = require('svg2png');
const Jimp = require('jimp');
const fs =  require('fs');

const webshotOptions = {
  windowSize: { width: 1024, height: 768 }
, shotSize: { width: 1024, height: 'all' }
, phantomPath: 'phantomjs'
, siteType: 'html'
, streamType:	'png'
, renderDelay: 0
};

const fileOutputDelayMS = 1000;

// Handles both types of images to render
function renderImageFromHeadline(headline, outputPath) {
  if(headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		const svg = headline.tags.svg.svgString;
		console.log(`\nRendering SVG:\n\n ${svg}`);
		return renderImageFromSvg(svg, outputPath);
	} else if(headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
		const html = headline.tags.htmlImg.htmlImgString;
		console.log(`\nRendering HTML:\n\n ${html}`);
		return renderImageFromHtml(html, outputPath);
	} else {
    return Promise.resolve({ rendered: false, msg: `No image was required.`});
  }
}

function renderImageFromHtml(html, outputPath) {
  return new Promise((resolve, reject) => {
    const tempFile = `${outputPath}.tmp.png`;

    webshot(html, tempFile, webshotOptions, (err) => {
      if (err) {
        reject(err);
        return;
      }

      Jimp.read(tempFile)
        .then(image => image.autocrop().write(outputPath))
        .then(() => {
            setTimeout(() => resolve({
                rendered: true,
                path: outputPath,
                msg: `Image rendered to ${outputPath}`
            }), fileOutputDelayMS);
        })
          .then(() => fs.unlink(tempFile, (err) => {
              if (err) {
                  reject(err);
              }
          }))
        .catch(err => reject(err));
    });
  });
}

function renderImageFromSvg(svg, outputPath) {
  return svg2png(new Buffer(svg), { filename: __dirname })
    .catch(e => console.log('\n *** Failed to create png: ' + e))
    .then(data => {
      console.log('SVG:'); console.log(svg);
      fs.writeFileSync(outputPath, data);
      console.log('\n *** Image saved to ' + outputPath);
      return {
        rendered: true,
        path: outputPath,
        msg: `Image rendered to ${outputPath}`
      };
    })
    .catch(e => console.log('*** Failed to render image: ' + e));
}

module.exports = {
  fromHeadline: renderImageFromHeadline,
  fromHtml: renderImageFromHtml,
  fromSvg: renderImageFromSvg
};
