// scripts/generate_thumbar_icons.cjs
// Generates 24x24 PNG icons for Windows Taskbar Thumbnail Toolbar
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

function createPng(width, height, pixelFn) {
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const rgba = pixelFn(x, y, width, height);
      rawData[pxOffset + 0] = rgba[0];
      rawData[pxOffset + 1] = rgba[1];
      rawData[pxOffset + 2] = rgba[2];
      rawData[pxOffset + 3] = rgba[3];
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressedData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const assetsDir = path.join(__dirname, '..', 'electron', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Play icon (triangle pointing right)
const playPng = createPng(24, 24, (x, y) => {
  // triangle from (7, 5) to (18, 12) to (7, 19)
  if (x >= 7 && x <= 18) {
    const halfH = ((x - 7) / (18 - 7)) * 7;
    if (Math.abs(y - 12) <= 7 - halfH) {
      return [254, 196, 134, 255]; // Amber gold
    }
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(assetsDir, 'play.png'), playPng);

// 2. Pause icon (two bars)
const pausePng = createPng(24, 24, (x, y) => {
  if (y >= 5 && y <= 19) {
    if ((x >= 6 && x <= 9) || (x >= 14 && x <= 17)) {
      return [254, 196, 134, 255];
    }
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(assetsDir, 'pause.png'), pausePng);

// 3. Prev icon (bar + triangle left)
const prevPng = createPng(24, 24, (x, y) => {
  if (y >= 6 && y <= 18) {
    if (x >= 5 && x <= 7) return [254, 196, 134, 255]; // Bar
    // triangle from (18, 6) to (8, 12) to (18, 18)
    if (x >= 8 && x <= 18) {
      const halfH = ((18 - x) / 10) * 6;
      if (Math.abs(y - 12) <= 6 - halfH) return [254, 196, 134, 255];
    }
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(assetsDir, 'prev.png'), prevPng);

// 4. Next icon (triangle right + bar)
const nextPng = createPng(24, 24, (x, y) => {
  if (y >= 6 && y <= 18) {
    if (x >= 16 && x <= 18) return [254, 196, 134, 255]; // Bar
    // triangle from (6, 6) to (15, 12) to (6, 18)
    if (x >= 6 && x <= 15) {
      const halfH = ((x - 6) / 9) * 6;
      if (Math.abs(y - 12) <= 6 - halfH) return [254, 196, 134, 255];
    }
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(assetsDir, 'next.png'), nextPng);

console.log('Thumbar icons gerados em electron/assets/: play.png, pause.png, prev.png, next.png');
