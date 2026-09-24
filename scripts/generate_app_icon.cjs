// scripts/generate_app_icon.js
// Generates high-res PNG and ICO icons for Vitrola desktop application
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function createVinylPng(size = 256) {
  const width = size;
  const height = size;
  const center = size / 2;
  const radius = size * 0.46;
  const labelRadius = radius * 0.38;
  const holeRadius = radius * 0.08;

  // Uncompressed scanlines: 1 filter byte (0) per line + width * 4 bytes RGBA
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      if (dist > radius) {
        // Transparent outside vinyl
        rawData[pxOffset + 0] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      } else if (dist <= holeRadius) {
        // Spindle hole
        const holeEdge = dist / holeRadius;
        if (holeEdge > 0.85) {
          // Brass ring around spindle hole
          rawData[pxOffset + 0] = 230;
          rawData[pxOffset + 1] = 180;
          rawData[pxOffset + 2] = 90;
          rawData[pxOffset + 3] = 255;
        } else {
          // Hole itself (transparent)
          rawData[pxOffset + 0] = 12;
          rawData[pxOffset + 1] = 10;
          rawData[pxOffset + 2] = 9;
          rawData[pxOffset + 3] = 255;
        }
      } else if (dist <= labelRadius) {
        // Center label (Vintage Amber/Orange with gold foil rim)
        const labelRel = (dist - holeRadius) / (labelRadius - holeRadius);
        if (labelRel > 0.94) {
          // Brass outer rim of label
          rawData[pxOffset + 0] = 245;
          rawData[pxOffset + 1] = 195;
          rawData[pxOffset + 2] = 110;
          rawData[pxOffset + 3] = 255;
        } else {
          // Amber record label with gradient
          const glow = Math.sin(angle * 2) * 15;
          rawData[pxOffset + 0] = Math.min(255, 217 + glow);
          rawData[pxOffset + 1] = Math.min(255, 119 + glow * 0.6);
          rawData[pxOffset + 2] = Math.min(255, 16 + glow * 0.2);
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Vinyl grooves area
        const grooveRel = (dist - labelRadius) / (radius - labelRadius);
        // Micro-grooves effect (rings)
        const grooveVal = Math.sin(dist * 2.8) * 18;
        // Radial light sheen (two opposite light reflection cones)
        const sheen = Math.pow(Math.abs(Math.sin(angle + 0.6)), 8) * 45;
        const base = Math.max(10, Math.min(65, 20 + grooveVal + sheen));

        // Outer brass bezel ring at edge
        if (grooveRel > 0.97) {
          rawData[pxOffset + 0] = 210;
          rawData[pxOffset + 1] = 160;
          rawData[pxOffset + 2] = 70;
          rawData[pxOffset + 3] = 255;
        } else {
          rawData[pxOffset + 0] = base + 4;
          rawData[pxOffset + 1] = base + 2;
          rawData[pxOffset + 2] = base;
          rawData[pxOffset + 3] = 255;
        }
      }
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression: Deflate
  ihdr[11] = 0; // Filter: Standard
  ihdr[12] = 0; // Interlace: None

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createIcoFile(pngBuffers) {
  // Create an ICO containing the PNG images
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(numImages, 4); // Count

  let offset = 6 + (numImages * 16);
  const entries = [];

  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size; // Width (0 means 256)
    entry[1] = size >= 256 ? 0 : size; // Height
    entry[2] = 0; // Color count
    entry[3] = 0; // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bit count (32bpp RGBA)
    entry.writeUInt32LE(buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data
    entries.push(entry);
    offset += buffer.length;
  }

  const body = Buffer.concat(pngBuffers.map(item => item.buffer));
  return Buffer.concat([header, ...entries, body]);
}

// Generate sizes
console.log('Gerando ícones em alta resolução para a Vitrola...');
const png256 = createVinylPng(256);
const png128 = createVinylPng(128);
const png64 = createVinylPng(64);
const png48 = createVinylPng(48);
const png32 = createVinylPng(32);
const png16 = createVinylPng(16);

const icoBuffer = createIcoFile([
  { buffer: png256, size: 256 },
  { buffer: png128, size: 128 },
  { buffer: png64, size: 64 },
  { buffer: png48, size: 48 },
  { buffer: png32, size: 32 },
  { buffer: png16, size: 16 }
]);

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon.png'), png256);
fs.writeFileSync(path.join(publicDir, 'icon.ico'), icoBuffer);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

// Also copy to root for electron-builder / windows installer
fs.writeFileSync(path.join(__dirname, '..', 'icon.ico'), icoBuffer);
fs.writeFileSync(path.join(__dirname, '..', 'icon.png'), png256);

console.log('Icones gerados com sucesso em public/icon.png e public/icon.ico!');
