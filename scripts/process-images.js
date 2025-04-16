const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseInputDir = path.join(__dirname, '..', 'public', 'images');
const baseOutputDir = path.join(__dirname, '..', 'public', 'images', 'processed');

const sizes = [400, 800, 1200]; // Responsive sizes

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
                await sharp(inputPath)
                    .resize({ width: size, height: Math.round(size * 9 / 16), fit: 'cover', position: 'center' })
                    .webp({ quality: 90 })
                    .toFile(outputPath);
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
                await sharp(inputPath)
                    .resize({ width: size, height: size, fit: 'cover', position: 'center' })
                    .webp({ quality: 90 })
                    .toFile(outputPath);
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
                await sharp(inputPath)
                    .resize({ width: size, fit: 'inside' })
                    .webp({ quality: 90 })
                    .toFile(outputPath);
            }
        }
    }
}

async function main() {
    await processCarouselImages();
    await processBlogThumbnails();
    await processBlogHeaders();
    console.log('Image processing complete.');
}

main();