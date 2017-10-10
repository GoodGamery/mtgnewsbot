// Utility for rendering html images to files
'use strict';
const webshot = require('webshot');
const svg2png = require('svg2png');
const Jimp = require('jimp');
const fs =  require('fs');
const config = global.mtgnewsbot.config;

const webshotOptions = {
  windowSize: { width: 1024, height: 768 }
  , shotSize: { width: 1024, height: 'all' }
  , phantomPath: 'phantomjs'
  , siteType: 'html'
  , streamType:	'png'
  , renderDelay: 0
};

// Handles both types of images to render
function renderImageFromHeadline(headline, outputPath) {
  if(headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
    const svg = headline.tags.svg.svgString;

    config.loggers.svg.log(`\nRendering SVG:\n\n ${svg}`);

    return renderImageFromSvg(svg, outputPath);
  } else if(headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
    const html = headline.tags.htmlImg.htmlImgString;
    
    config.loggers.html.log(`\nRendering HTML:\n\n ${html}`);

    const cropOptions = {
      width: 		parseInt(headline.tags.htmlImg.width),
      height: 	parseInt(headline.tags.htmlImg.height),
      padding: 	parseInt(headline.tags.htmlImg.padding)
    };
    const backgroundOptions = {
      color:  parseInt(headline.tags.htmlImg.backgroundColor),
      image:  headline.tags.htmlImg.backgroundImage
    };
    const screenOptions = {
      width:  parseInt(headline.tags.htmlImg.screenWidth),
      height:  parseInt(headline.tags.htmlImg.screenHeight)
    };    
    return renderImageFromHtml(html, outputPath, { crop: cropOptions, background: backgroundOptions, screen: screenOptions });
  } else {
    return Promise.resolve({ rendered: false, msg: `No image was required.`});
  }
}

function renderImageFromHtml(html, outputPath, imageOptions) {
  return new Promise((resolve, reject) => {
    const tempFile = `${outputPath}.tmp.png`;

    if (imageOptions.screen.width) {      
      webshotOptions.windowSize.width = imageOptions.screen.width;
      webshotOptions.shotSize.width = imageOptions.screen.width;    
    }
    if (imageOptions.screen.height) {
      webshotOptions.windowSize.height = imageOptions.screen.height;
    }

    webshot(html, tempFile, webshotOptions, (err) => {
      if (err) {
        reject(err);
        return;
      }

      Jimp.read(tempFile)
        .then(tempFile => cropAndWriteFile(outputPath, imageOptions, tempFile))
        .then(() => {
          resolve({
            rendered: true,
            path: outputPath,
            msg: `Image rendered to ${outputPath}`
          });
        })
        .then(config.debugOptions.deleteTempImages ? () => fs.unlink(tempFile, (err) => {
          if (err) {
            reject(err);
          }
        }) : undefined)
        .catch(err => reject(err));
    });
  });
}

function cropAndWriteFile(path, imageOptions, sourceImage) {
  const writeImage = image => {
    return new Promise((resolve, reject) => {
      image.write(path, err => {
        if (err) {
          reject(err);
        } else {
          resolve(path);
        }
      });
    });
  };

  const cropOptions = imageOptions.crop;

  const backgroundOptions = imageOptions.background;

	return new Promise((resolve, reject) => {
    let cropPromise = new Promise((resolve, reject) => {

      if (cropOptions.width && cropOptions.height) {
        return sourceImage.autocrop((err, image) => {
          if (err) {
            reject(err);
          }

          const padding = cropOptions.padding || 0;
          const needsMatting = sourceImage.bitmap.width + padding < cropOptions.width  || sourceImage.bitmap.height + padding < cropOptions.height;
          const imgWidth = sourceImage.bitmap.width < cropOptions.width ? sourceImage.bitmap.width : cropOptions.width;
          const imgHeight =  sourceImage.bitmap.height < cropOptions.height ? sourceImage.bitmap.height : cropOptions.height;
          const backgroundColor = backgroundOptions.color || 0xFFFFFFFF;

          return new Jimp(imgWidth + padding, imgHeight + padding, backgroundColor, (err, background) => {
            if (err) {
              reject(err);
            }    

            if (needsMatting) {
              background.composite(image, padding/2, padding/2).contain(cropOptions.width, cropOptions.height, (err, image) => {
                if (err) {
                  reject(err);
                }            
                  resolve(image);
              });
            } else {
              image.crop(0, 0, cropOptions.width, cropOptions.height, (err, image) => {
                if (err) {
                  reject(err);
                }            
                  resolve(image);
              });
            }
          });
        });
      } else {
        return sourceImage.autocrop((err, image) => {
          if (err) {
            reject(err);
          }        
          resolve(image);
        });
      }
    });

    return cropPromise.then(logoImage => {
      if (!backgroundOptions.image) {
        return writeImage(logoImage).then(resolve);
      }
      return Jimp.read(backgroundOptions.image, (err, backgroundImage) => {
        if (err) {
          reject(err);
        }
     
        const backgroundWidth = backgroundImage.bitmap.width;
        const backgroundHeight = backgroundImage.bitmap.height;
        const padding = 8;

        var imgWidth = logoImage.bitmap.width;
        var imgHeight = logoImage.bitmap.height;

        const compositeCallback = (err, image) => {          
          imgWidth = image.bitmap.width;
          imgHeight = image.bitmap.height;

          backgroundImage.composite(image, (backgroundWidth - imgWidth)/2, (backgroundHeight - imgHeight)/2, err => {
            if (err) {
              reject(err);
            }          
            return writeImage(backgroundImage).then(resolve);
          });          
        };

        if (imgWidth > backgroundWidth - 2 * padding || imgHeight > backgroundHeight - 2 * padding) {
          logoImage.scaleToFit(backgroundWidth - 2 * padding, backgroundHeight - 2 * padding, compositeCallback);
        } else {
          compositeCallback(null, logoImage);
        }
      });
    });
  });
}

function renderImageFromSvg(svg, outputPath) {
  return svg2png(new Buffer(svg), { filename: __dirname })
    .catch(e => console.log('\n *** Failed to create png: ' + e))
    .then(data => {
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
