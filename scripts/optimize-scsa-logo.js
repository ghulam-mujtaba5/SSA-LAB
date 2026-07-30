const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLogo() {
  const rootDir = path.join(__dirname, '..');
  const inputFile = path.join(rootDir, 'ChatGPT Image Jul 30, 2026, 02_57_18 PM.png');
  const targetDir = path.join(rootDir, 'public', 'academic');
  const publicDir = path.join(rootDir, 'public');

  if (!fs.existsSync(inputFile)) {
    console.error('Source logo file not found at:', inputFile);
    return;
  }

  console.log('⚡ Processing and compressing SCSA logo without quality compromise...');
  
  const metadata = await sharp(inputFile).metadata();
  console.log(`Original dimensions: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Ensure output dir exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Production PNG for scsa-research-group-logo.png (1536x1024)
  const targetPng = path.join(targetDir, 'scsa-research-group-logo.png');
  await sharp(inputFile)
    .png({ quality: 95, compressionLevel: 9, palette: true })
    .toFile(targetPng);
  
  // 2. Production WebP version (for modern browsers & Next.js Image component)
  const targetWebP = path.join(targetDir, 'scsa-research-group-logo.webp');
  await sharp(inputFile)
    .webp({ quality: 92, lossless: false })
    .toFile(targetWebP);

  // 3. Convenience root public copies
  await sharp(inputFile)
    .png({ quality: 95, compressionLevel: 9, palette: true })
    .toFile(path.join(publicDir, 'scsa-logo.png'));

  await sharp(inputFile)
    .webp({ quality: 92, lossless: false })
    .toFile(path.join(publicDir, 'scsa-logo.webp'));

  // 4. Square Icons (512, 192, 64, 32) centered with transparent padding for PWA & favicon
  const squareSizes = [512, 192, 64, 32];
  for (const size of squareSizes) {
    const resizedBuffer = await sharp(inputFile)
      .resize(size, Math.round(size * (1024 / 1536)), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 95, compressionLevel: 9 })
      .toBuffer();

    // Composite centered on square
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: resizedBuffer, gravity: 'center' }])
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(targetDir, `scsa-logo-${size}.png`));
  }

  const origSize = fs.statSync(inputFile).size;
  const newPngSize = fs.statSync(targetPng).size;
  const newWebpSize = fs.statSync(targetWebP).size;

  console.log(`✅ Original File Size: ${(origSize / 1024 / 1024).toFixed(2)} MB (${origSize} bytes)`);
  console.log(`✅ Compressed PNG Size: ${(newPngSize / 1024).toFixed(1)} KB (${newPngSize} bytes) -> ${((1 - newPngSize / origSize) * 100).toFixed(1)}% reduction!`);
  console.log(`✅ Compressed WebP Size: ${(newWebpSize / 1024).toFixed(1)} KB (${newWebpSize} bytes) -> ${((1 - newWebpSize / origSize) * 100).toFixed(1)}% reduction!`);

  // Move or delete original raw chatgpt file from root to scratch folder
  const scratchDir = path.join(rootDir, 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  fs.renameSync(inputFile, path.join(scratchDir, 'ChatGPT Image Jul 30, 2026, 02_57_18 PM.png'));
  console.log(`✅ Moved raw original image from workspace root to scratch/ directory.`);
}

optimizeLogo().catch(console.error);
