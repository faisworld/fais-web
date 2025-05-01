const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'images.json');
const images = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const fixed = images.map(img => {
  if (img['alt-tag']) {
    img.altTag = img['alt-tag'];
    delete img['alt-tag'];
  }
  return img;
});

fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf8');
console.log('alt-tag keys replaced with altTag.');
