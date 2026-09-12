/* ============================================================================
   make-images.mjs — turn the phone photos in _raw/ into web images.

   For every picture in _raw/ this writes two JPEGs:

       images/thumbs/<name>.jpg    400 px on the long side, quality 72  (card)
       images/full/<name>.jpg     1200 px on the long side, quality 82  (lightbox)

   Then it prints the  img: 'name.jpg'  lines to paste into data.js.

   THIS SCRIPT IS NOT PART OF THE SITE. The site stays plain HTML, CSS and
   vanilla JS with no build step; nothing in index.html or ru.html loads
   anything from tools/ or node_modules/. This is a tool you run on your own
   machine, the way you would run Paint — it just does the same job the same
   way every time instead of you clicking through a dialog.

   Run it:   cd tools  &&  npm install  &&  npm run images

   ---------------------------------------------------------------------------
   WHY A SCRIPT AND NOT PAINT

   Three things have to be right on every single scan, and all three are easy
   to forget by hand:

   1. TWO SIZES. A 400 px thumbnail for the grid and a 1200 px version for the
      lightbox. Sending the 1200 px file to the grid means the browser
      downloads fourteen big images in order to show fourteen small ones.

   2. NO EXIF. A phone photo carries a hidden block of metadata: camera model,
      exact timestamp and — on most phones — the GPS coordinates of the spot
      where the picture was taken. That is usually your home or your school.
      This archive will be public, and anyone can read those coordinates out
      of a published JPEG with a free tool. Stripping them is not optional.

   3. ONE PREDICTABLE FILENAME. Windows treats Photo.JPG and photo.jpg as the
      same file. Vercel runs Linux, where they are two different files. A name
      that works when you double-click index.html can 404 after deploying, so
      this script refuses a bad name up front instead of letting you find out
      a week later.
   ========================================================================= */

import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* --------------------------------------------------------------------------
   PATHS

   import.meta.url is the address of THIS file. Resolving everything against
   it — rather than against whichever folder you happen to be standing in —
   means the script behaves the same run from tools/ or from the project root.
-------------------------------------------------------------------------- */
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const RAW_DIR = path.join(ROOT, '_raw');

const SIZES = [
  { key: 'thumb', dir: path.join(ROOT, 'images', 'thumbs'), px: 400,  quality: 72 },
  { key: 'full',  dir: path.join(ROOT, 'images', 'full'),   px: 1200, quality: 82 }
];

/* Extensions we know how to read. Compared against the LOWERCASED extension,
   so that a file called PHOTO.JPG is picked up and then properly refused for
   its uppercase name — rather than silently ignored as "not an image", which
   would look exactly like the script not seeing the file at all. */
const READABLE = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/* --------------------------------------------------------------------------
   LOADING SHARP

   sharp is the image library. It is a devDependency: installed on your
   machine, never uploaded to Vercel, never referenced by the site.

   The import sits in a try/catch because the interesting failure here is "you
   have not run npm install yet", and Node's own message for that is a wall of
   stack trace that never says what to do about it.
-------------------------------------------------------------------------- */
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('\nCannot load sharp — the image library is not installed.\n');
  console.error('Fix it with:\n');
  console.error('    cd tools');
  console.error('    npm install\n');
  process.exit(1);
}

/* --------------------------------------------------------------------------
   FILENAME RULES

   Returns the list of reasons a name is unusable, empty if the name is fine.
   Every reason is collected rather than only the first, so that one round of
   renaming fixes the file instead of three.
-------------------------------------------------------------------------- */
function nameProblems(name) {
  const problems = [];

  if (/\s/.test(name))                problems.push('it contains a space');
  if (/[A-Z]/.test(name))             problems.push('it contains uppercase letters');
  if (/[Ѐ-ӿ]/.test(name))            problems.push('it contains Cyrillic letters');

  /* Everything the three rules above did not already account for. Removing
     what has already been named keeps the report from saying the same thing
     twice about one character. The range Ѐ-ӿ is the Cyrillic block. */
  const leftover = name.replace(/\s|[A-Z]|[Ѐ-ӿ]/g, '');
  if (/[^a-z0-9._-]/.test(leftover)) {
    problems.push('it contains punctuation other than . - _');
  }

  return problems;
}

/* Bytes as something a human reads at a glance. */
function human(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return Math.round(bytes / 1024) + ' KB';
}

/* --------------------------------------------------------------------------
   IS THE OUTPUT STILL GOOD?

   Re-running the script should be cheap, so a file is reprocessed only when
   its source is newer than what we produced last time. mtimeMs is the "last
   modified" timestamp in milliseconds. A missing output file throws, which
   counts as "not fresh".
-------------------------------------------------------------------------- */
async function isFresh(outPath, sourceMtime) {
  try {
    const s = await stat(outPath);
    return s.mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------------------
   THE CONVERSION ITSELF

   .rotate() with no arguments is doing something specific and easy to miss.
   A phone does not turn the pixels when you hold it sideways; it stores the
   picture as the sensor saw it and writes an EXIF "Orientation" tag saying
   which way is up. Strip EXIF without acting on that tag first and every
   portrait photo comes out lying on its side. .rotate() bakes the rotation
   into the actual pixels, and the tag is then no longer needed.

   sharp drops all other metadata by default — we never call .withMetadata(),
   so GPS, timestamp and camera model do not survive into the output.

   fit:'inside' scales the picture until it fits inside a px × px box, which
   constrains the LONG side whichever way the photo is turned, and preserves
   the aspect ratio. withoutEnlargement:true means an image already smaller
   than the box is written at its own size rather than blown up into a blurry
   mess — upscaling never adds detail, it only adds kilobytes.
-------------------------------------------------------------------------- */
async function convert(srcPath, outPath, px, quality) {
  const info = await sharp(srcPath)
    .rotate()
    .resize({ width: px, height: px, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality })
    .toFile(outPath);
  return info.size;
}

/* ==========================================================================
   MAIN
   ========================================================================== */

await mkdir(RAW_DIR, { recursive: true });
for (const size of SIZES) await mkdir(size.dir, { recursive: true });

const entries = await readdir(RAW_DIR, { withFileTypes: true });

const candidates = entries
  .filter((e) => e.isFile())
  .map((e) => e.name)
  .filter((name) => READABLE.has(path.extname(name).toLowerCase()))
  .sort();

if (candidates.length === 0) {
  console.log('\n_raw/ has no .jpg, .jpeg, .png or .webp files in it.');
  console.log('Put the photos of your certificates there and run this again.\n');
  process.exit(0);
}

const refused = [];         /* { name, reasons[] }                              */
const done = [];            /* { out, srcBytes, thumbBytes, fullBytes, skipped } */
const claimed = new Map();  /* output name -> source name, to catch collisions   */

for (const name of candidates) {
  const problems = nameProblems(name);

  /* Every output is a JPEG, so a .png source becomes <name>.jpg. Two sources
     sharing a stem — logo.png and logo.jpg — would therefore write to the same
     output, and the second would silently overwrite the first. */
  const outName = path.basename(name, path.extname(name)) + '.jpg';
  if (claimed.has(outName)) {
    problems.push('it would overwrite the output of ' + claimed.get(outName) +
                  ' (both become ' + outName + ')');
  }

  if (problems.length > 0) {
    refused.push({ name, reasons: problems });
    continue;
  }
  claimed.set(outName, name);

  const srcPath = path.join(RAW_DIR, name);
  const srcStat = await stat(srcPath);

  const outPaths = SIZES.map((s) => path.join(s.dir, outName));
  const fresh = (await Promise.all(
    outPaths.map((p) => isFresh(p, srcStat.mtimeMs))
  )).every(Boolean);

  /* One unreadable file - a truncated download, a .jpg that is really a HEIC
     with the wrong extension - should cost you that one file, not the whole
     run. Without this catch the first bad photo throws and the nine good ones
     behind it are never converted. */
  let sizes;
  try {
    if (fresh) {
      sizes = await Promise.all(outPaths.map(async (p) => (await stat(p)).size));
    } else {
      sizes = [];
      for (let i = 0; i < SIZES.length; i++) {
        sizes.push(await convert(srcPath, outPaths[i], SIZES[i].px, SIZES[i].quality));
      }
    }
  } catch (err) {
    refused.push({ name, reasons: ['it could not be read as an image (' + err.message + ')'] });
    continue;
  }

  done.push({
    out: outName,
    srcBytes: srcStat.size,
    thumbBytes: sizes[0],
    fullBytes: sizes[1],
    skipped: fresh
  });
}

/* ---- one line per file ---- */

if (done.length > 0) {
  const width = Math.max(...done.map((d) => d.out.length));
  console.log('');
  for (const d of done) {
    console.log(
      '  ' + d.out.padEnd(width) +
      '  ' + human(d.srcBytes).padStart(8) +
      '  ->  thumb ' + human(d.thumbBytes).padStart(7) +
      '   full ' + human(d.fullBytes).padStart(7) +
      (d.skipped ? '   (already up to date)' : '')
    );
  }

  /* ---- the block to paste into data.js ---- */

  console.log('\n  ' + '-'.repeat(62));
  console.log('  For data.js — img holds the bare filename, and app.js builds');
  console.log('  images/thumbs/<img> for the card and images/full/<img> for');
  console.log('  the lightbox:\n');
  for (const d of done) {
    console.log("    img: '" + d.out + "',");
  }
  console.log('');
}

/* ---- names that were not converted ---- */

if (refused.length > 0) {
  console.log('  ' + '-'.repeat(62));
  console.log('  REFUSED — these were NOT converted:\n');
  for (const r of refused) {
    console.log('    ' + r.name);
    for (const reason of r.reasons) console.log('      because ' + reason);
  }
  console.log('\n  A filename becomes part of the public web address, so a name with a');
  console.log('  space or a capital letter in it works on Windows and 404s on Vercel.');
  console.log('  Fix these in _raw/ - rename with lowercase Latin letters and hyphens -');
  console.log('  then run the script again. See images/README.md.\n');

  /* Exit code 1 means "something did not go through". Harmless in a terminal,
     and it is the signal any future automation would look at. */
  process.exit(1);
}
