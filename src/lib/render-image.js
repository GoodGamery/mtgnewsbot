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

// Handles both types of images to render
function renderImageFromHeadline(headline, outputPath) {
  if(headline.tags && headline.tags.svg && headline.tags.svg.svgString) {
		const svg = headline.tags.svg.svgString;
		console.log(`\nRendering SVG:\n\n ${svg}`);
		return renderImageFromSvg(svg, outputPath);
	} else if(headline.tags && headline.tags.htmlImg && headline.tags.htmlImg.htmlImgString) {
		const html = headline.tags.htmlImg.htmlImgString;	
		console.log(`\nRendering HTML:\n\n ${html}`);
		const cropOptions = {
			width: 		parseInt(headline.tags.htmlImg.width),
			height: 	parseInt(headline.tags.htmlImg.height),
			padding: 	parseInt(headline.tags.htmlImg.padding),
			backgroundColor: 	parseInt(headline.tags.htmlImg.backgroundColor)
		};
		return renderImageFromHtml(html, outputPath, cropOptions);
	} else {
    return Promise.resolve({ rendered: false, msg: `No image was required.`});
  }
}

function renderImageFromHtml(html, outputPath, cropOptions) {
  return new Promise((resolve, reject) => {
    const tempFile = `${outputPath}.tmp.png`;

    webshot(html, tempFile, webshotOptions, (err) => {
      if (err) {
        reject(err);
        return;
      }

      Jimp.read(tempFile)
        .then(cropAndWriteFile.bind(null, outputPath, cropOptions))
        .then(() => {
            resolve({
                rendered: true,
                path: outputPath,
                msg: `Image rendered to ${outputPath}`
            });
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

function cropAndWriteFile(path, cropOptions, sourceImage) {

	const writeImage = image => {
		return new Promise((resolve, reject) => {
	  	image.write(path, (err) => {
	      if (err)
	        reject(err);
	      else
	        resolve(path);
	    });
	  });
	};

	if (cropOptions.width && cropOptions.height) {
		return sourceImage.autocrop((err, image) => {
	 		const logoWidth = image.bitmap.width;
	  	const logoHeight =  image.bitmap.height;
	  	const padding = cropOptions.padding;
			const backgroundColor = cropOptions.backgroundColor || 0xFFFFFFFF;
	  	image = new Jimp(logoWidth + padding, logoHeight + padding, backgroundColor, (err, background) => {
	  		background.composite(image, padding/2, padding/2).contain(cropOptions.width, cropOptions.height, (err, image) => {
					return writeImage(image);
				});
	  	});
		});
	} else {
		return sourceImage.autocrop((err, image) => {
			return writeImage(image);
		});
	}

  
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
