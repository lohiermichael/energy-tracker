import sharp from 'sharp';

async function generateIcons() {
  const input = './public/energy-tracker-logo.png';

  await sharp(input)
    .resize(16, 16)
    .toFile('./public/favicon-16x16.png');

  await sharp(input)
    .resize(32, 32)
    .toFile('./public/favicon-32x32.png');

  await sharp(input)
    .resize(180, 180)
    .toFile('./public/apple-icon.png');

  await sharp(input)
    .resize(1200, 630)
    .toFile('./public/opengraph-image.png');

}

generateIcons().catch(console.error);

