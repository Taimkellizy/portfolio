/* Regenerates the Google-friendly raster icons from app/icon.svg:
   app/icon.png (192px, a multiple of 48 as Google asks) and
   public/favicon.ico (16/32/48 PNG-in-ICO). Run: node scripts/make-favicon.cjs */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const svg = fs.readFileSync(path.join(root, "app", "icon.svg"));

async function png(size) {
  return sharp(svg, { density: 300 }).resize(size, size).png().toBuffer();
}

function ico(buffers, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((size, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buffers[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buffers[i].length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...buffers]);
}

(async () => {
  fs.writeFileSync(path.join(root, "app", "icon.png"), await png(192));
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(sizes.map(png));
  fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico(buffers, sizes));
  console.log("wrote app/icon.png and public/favicon.ico");
})();
