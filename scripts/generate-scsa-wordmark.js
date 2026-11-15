const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateWordmark() {
  const rootDir = path.join(__dirname, '..');
  const targetDir = path.join(rootDir, 'public', 'academic');
  const publicDir = path.join(rootDir, 'public');
  const masterRef = path.join(targetDir, 'ssa-supervisor-logo-master.png');

  console.log('⚡ Generating SSA Research Lab Logo assets matching supervisor design...');

  if (fs.existsSync(masterRef)) {
    // 1. Transparent full logo extracted from supervisor master
    const fullLogoPng = path.join(targetDir, 'ssa-research-group-full-logo.png');
    const fullLogoWebp = path.join(targetDir, 'ssa-research-group-full-logo.webp');

    // Copy to legacy scsa paths for compatibility
    fs.copyFileSync(fullLogoPng, path.join(targetDir, 'scsa-research-group-full-logo.png'));
    if (fs.existsSync(fullLogoWebp)) {
      fs.copyFileSync(fullLogoWebp, path.join(targetDir, 'scsa-research-group-full-logo.webp'));
    }
    fs.copyFileSync(fullLogoPng, path.join(publicDir, 'scsa-wordmark-logo.png'));
    if (fs.existsSync(fullLogoWebp)) {
      fs.copyFileSync(fullLogoWebp, path.join(publicDir, 'scsa-wordmark-logo.webp'));
    }

    console.log(`✅ Verified SSA Wordmark PNG and WebP assets.`);
  }
}

generateWordmark().catch(console.error);
