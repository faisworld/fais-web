import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseInputDir = path.join(__dirname, '..', 'public', 'images');
const baseOutputDir = path.join(__dirname, '..', 'public', 'images', 'processed');
const sizes = [400, 800, 1200]; // Responsive sizes

async function resizeImage(inputPath, outputPath, width, height = null, fit = 'cover', quality = 90) {
  try {
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    let sharpInstance = sharp(inputPath).resize({ width, ...(height ? { height } : {}), fit, position: 'center' });
    await sharpInstance.webp({ quality }).toFile(outputPath);
    console.log(`Image resized: ${outputPath}`);
  } catch (error) {
    console.error(`Error resizing image ${inputPath}:`, error);
  }
}

async function processCarouselImages() {
  const inputDir = path.join(baseInputDir, 'carousel');
  const outputDir = path.join(baseOutputDir, 'carousel');
  if (!fs.existsSync(inputDir)) return;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      for (const size of sizes) {
        const outputFileName = `${path.basename(file, ext)}-${size}.webp`;
        const outputPath = path.join(outputDir, outputFileName);
        await resizeImage(inputPath, outputPath, size, Math.round(size * 9 / 16), 'cover', 90);
      }
    }
  }
}

async function processBlogThumbnails() {
  const inputDir = path.join(baseInputDir, 'blog', 'thumbnails');
  const outputDir = path.join(baseOutputDir, 'blog', 'thumbnails');
  if (!fs.existsSync(inputDir)) return;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      for (const size of sizes) {
        const outputFileName = `${path.basename(file, ext)}-${size}x${size}.webp`;
        const outputPath = path.join(outputDir, outputFileName);
        await resizeImage(inputPath, outputPath, size, size, 'cover', 90);
      }
    }
  }
}

async function processBlogHeaders() {
  const inputDir = path.join(baseInputDir, 'blog', 'headers');
  const outputDir = path.join(baseOutputDir, 'blog', 'headers');
  if (!fs.existsSync(inputDir)) return;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      for (const size of sizes) {
        const outputFileName = `${path.basename(file, ext)}-${size}w.webp`;
        const outputPath = path.join(outputDir, outputFileName);
        await resizeImage(inputPath, outputPath, size, null, 'inside', 90);
      }
    }
  }
}

async function processOriginals() {
  const inputDir = path.join(baseInputDir, 'originals');
  const outputDir = path.join(baseOutputDir, 'originals');
  if (!fs.existsSync(inputDir)) return;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      for (const size of sizes) {
        const outputFileName = `${path.basename(file, ext)}-${size}.webp`;
        const outputPath = path.join(outputDir, outputFileName);
        await resizeImage(inputPath, outputPath, size, null, 'cover', 75);
      }
    }
  }
}

async function main() {
  await processCarouselImages();
  await processBlogThumbnails();
  await processBlogHeaders();
  await processOriginals();
  console.log('Image processing complete.');
}

main();