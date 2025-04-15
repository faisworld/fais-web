// filepath: c:\Users\solar\Projects\fais-web\scripts\process-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'public', 'images', 'originals'); // Adjust path
const outputDir = path.join(__dirname, '..', 'public', 'images', 'processed'); // Adjust path

async function resizeImage(inputPath, outputPath, width, quality = 80) {
  try {
    // Ensure output directory exists
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
        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) { // Add other supported input types if needed
            const inputPath = path.join(inputDir, file);
            const outputFileName = `${path.basename(file, ext)}.webp`; // Output as webp
            const outputPath = path.join(outputDir, outputFileName);

            // Example: Create an 800px wide version
            await resizeImage(inputPath, outputPath, 800, 75);
            // You could call resizeImage multiple times for different sizes
        }
    }
    console.log('Image processing complete.');
}

processDirectory();