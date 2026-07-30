const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateWordmark() {
  const rootDir = path.join(__dirname, '..');
  const shieldLogoPath = path.join(rootDir, 'public', 'academic', 'scsa-research-group-logo.png');
  const targetDir = path.join(rootDir, 'public', 'academic');
  const publicDir = path.join(rootDir, 'public');

  if (!fs.existsSync(shieldLogoPath)) {
    console.error('Shield logo file not found at:', shieldLogoPath);
    return;
  }

  console.log('⚡ Generating SCSA-Lab Wordmark Logo using existing 3D shield icon...');

  // Load metadata of shield logo
  const shieldMeta = await sharp(shieldLogoPath).metadata();
  console.log(`Shield logo dimensions: ${shieldMeta.width}x${shieldMeta.height}`);

  // Create canvas for Wordmark: Width 1536, Height 1400
  // Place shield at top (0,0), and SVG text underneath at bottom (1024-1400)
  const canvasWidth = 1536;
  const canvasHeight = 1400;

  // SVG overlay for text matching the screenshot styling:
  // "SSA-Lab" or "SCSA-Lab" + "Software Security Assessment Lab"
  const svgTextOverlay = `<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradient for SSA-Lab primary text -->
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f2b5c" />
        <stop offset="35%" stop-color="#164e87" />
        <stop offset="70%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>

      <!-- Drop shadow filter for 3D depth -->
      <filter id="3dShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.3" />
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.6" />
      </filter>

      <!-- Divider dot gradient -->
      <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>

    <!-- Main Title: SCSA-Lab / SSA-Lab -->
    <text 
      x="768" 
      y="1120" 
      text-anchor="middle" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
      font-weight="900" 
      font-size="142" 
      letter-spacing="-1.5"
      fill="url(#textGrad)"
      filter="url(#3dShadow)"
      stroke="#0a192f"
      stroke-width="3"
    >SCSA-Lab</text>

    <!-- Horizontal Divider Line with End Dots -->
    <g transform="translate(0, 1165)">
      <!-- Left line -->
      <line x1="380" y1="0" x2="720" y2="0" stroke="#0284c7" stroke-width="4" stroke-linecap="round" />
      <circle cx="380" cy="0" r="6" fill="url(#dotGrad)" />

      <!-- Center dot -->
      <circle cx="768" cy="0" r="5" fill="#06b6d4" />

      <!-- Right line -->
      <line x1="816" y1="0" x2="1156" y2="0" stroke="#0284c7" stroke-width="4" stroke-linecap="round" />
      <circle cx="1156" cy="0" r="6" fill="url(#dotGrad)" />
    </g>

    <!-- Subtitle: Software Security Assessment Lab -->
    <text 
      x="768" 
      y="1245" 
      text-anchor="middle" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
      font-weight="700" 
      font-size="44" 
      letter-spacing="2"
      fill="#1e293b"
    >Software Security Assessment Lab</text>
  </svg>`;

  // Render combined Wordmark image (Shield + Typography)
  const fullLogoPngPath = path.join(targetDir, 'scsa-research-group-full-logo.png');
  const fullLogoWebpPath = path.join(targetDir, 'scsa-research-group-full-logo.webp');

  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    { input: shieldLogoPath, top: 0, left: 0 },
    { input: Buffer.from(svgTextOverlay), top: 0, left: 0 }
  ])
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(fullLogoPngPath);

  // Also create WebP version
  await sharp(fullLogoPngPath)
    .webp({ quality: 92, lossless: false })
    .toFile(fullLogoWebpPath);

  // Copy to root public directory for easy access
  fs.copyFileSync(fullLogoPngPath, path.join(publicDir, 'scsa-wordmark-logo.png'));
  fs.copyFileSync(fullLogoWebpPath, path.join(publicDir, 'scsa-wordmark-logo.webp'));

  console.log(`✅ Generated SCSA Wordmark PNG: ${fullLogoPngPath} (${fs.statSync(fullLogoPngPath).size} bytes)`);
  console.log(`✅ Generated SCSA Wordmark WebP: ${fullLogoWebpPath} (${fs.statSync(fullLogoWebpPath).size} bytes)`);
}

generateWordmark().catch(console.error);
