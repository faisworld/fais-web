const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'public', 'images', 'originals');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'processed');
const sizes = [400, 800, 1200]; // Responsive sizes

async function resizeImage(inputPath, outputPath, width, quality = 80) {
  try {
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    await sharp(inputPath)
      .resize({ width: width })
      .webp({ quality: quality })
      .toFile(outputPath);
    console.log(`Image resized: ${outputPath}`);
  } catch (error) {
    console.error(`Error resizing image ${inputPath}:`, error);
  }
}

async function processDirectory() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    return;
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      for (const size of sizes) {
        const outputFileName = `${path.basename(file, ext)}-${size}.webp`;
        const outputPath = path.join(outputDir, outputFileName);
        await resizeImage(inputPath, outputPath, size, 75);
      }
    }
  }
  console.log('Image processing complete.');
}

processDirectory();