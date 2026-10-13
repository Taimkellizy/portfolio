// One-off: convert the heavy case PNGs to tuned WebP, report savings.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const jobs = [
  { in: "shaghal-hero.png", out: "shaghal-hero.webp", quality: 82 },
  { in: "meridian-report.png", out: "meridian-report.webp", quality: 82 },
];

(async () => {
  for (const { in: name, out, quality } of jobs) {
    const src = path.join("public", "cases", name);
    const dst = path.join("public", "cases", out);
    const before = fs.statSync(src).size;
    await sharp(src).webp({ quality }).toFile(dst);
    const after = fs.statSync(dst).size;
    console.log(`${name} ${before} -> ${out} ${after} (${(100 - (after / before) * 100).toFixed(1)}% smaller)`);
  }
})();
