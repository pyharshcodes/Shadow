const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:/Users/harsh/.gemini/antigravity/brain/a9e5dc74-05b6-4f59-bfb1-c5ddc8f74c22/.user_uploaded/media_1790144076024.png';
const brandDir = path.join(__dirname, '../public/images/brand');

async function processLogo() {
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  // 1. Trim whitespace
  const trimmed = await sharp(inputPath)
    .trim()
    .toBuffer();

  const trimmedMeta = await sharp(trimmed).metadata();
  console.log('Trimmed dimensions:', trimmedMeta.width, 'x', trimmedMeta.height);

  // Save trimmed
  await sharp(trimmed).toFile(path.join(brandDir, 'logo_trimmed.png'));

  // 2. Make transparent dark-mode logo (convert white background to transparent, and brown artwork to pure white)
  const { data, info } = await sharp(trimmed)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create two buffers:
  // a) transparent original (white -> transparent)
  // b) transparent bright white (white -> transparent, brown -> white for dark UI)
  const origTransp = Buffer.alloc(data.length);
  const whiteTransp = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is white / background (tolerance)
    if (r > 220 && g > 220 && b > 220) {
      origTransp[i] = 255;
      origTransp[i + 1] = 255;
      origTransp[i + 2] = 255;
      origTransp[i + 3] = 0; // alpha 0

      whiteTransp[i] = 255;
      whiteTransp[i + 1] = 255;
      whiteTransp[i + 2] = 255;
      whiteTransp[i + 3] = 0;
    } else {
      // Artwork pixel
      // calculate brightness
      const alpha = 255;
      origTransp[i] = r;
      origTransp[i + 1] = g;
      origTransp[i + 2] = b;
      origTransp[i + 3] = alpha;

      // Bright white for dark backgrounds
      whiteTransp[i] = 255;
      whiteTransp[i + 1] = 255;
      whiteTransp[i + 2] = 255;
      whiteTransp[i + 3] = 255;
    }
  }

  await sharp(origTransp, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(brandDir, 'logo_transparent.png'));

  await sharp(whiteTransp, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(brandDir, 'logo_white.png'));

  // Also copy logo_white to public/logo.png
  await sharp(whiteTransp, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/logo.png'));

  console.log('Successfully generated logo_trimmed.png, logo_transparent.png, and logo_white.png!');
}

processLogo().catch(console.error);
