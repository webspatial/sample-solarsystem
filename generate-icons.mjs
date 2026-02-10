import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.resolve('public');
const SIZES = [192, 512];

if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Simple SVG template for placeholder icons
const svgTemplate = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="#ffffff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${size / 5}" fill="#000000">PWA</text>
</svg>
`;

// Write SVG icons
SIZES.forEach(size => {
    const iconPath = path.join(PUBLIC_DIR, `icon-${size}.svg`); // Using SVG since we don't need heavy png deps
    // Note: Most modern browsers support SVG icons in manifest, but strict PWA audits might prefer PNG.
    // Since we cannot rely on sharp/jimp for PNG generation without install, we stick to SVG or just copy if source exists.
    // For this task, we'll generate SVG.
    fs.writeFileSync(iconPath, svgTemplate(size).trim());
    console.log(`Generated ${iconPath}`);
});

// Also try to copy a maskable icon if available, or just ignore for now as it's optional enhancement.
