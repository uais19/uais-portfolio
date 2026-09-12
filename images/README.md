# images/

Two folders, both filled by a script. You do not put anything here by hand.

    images/thumbs/    400 px copies. These are the pictures on the cards.
    images/full/     1200 px copies. These open in the lightbox.

The originals live in `_raw/`, one folder up. `_raw/` is in `.gitignore`, so the
big phone photos never enter the repository — only the two processed copies do.

## The loop

1. **Put the photo in `_raw/`.** Straight off the phone is fine. Any size, any
   megapixels, `.jpg` / `.jpeg` / `.png` / `.webp`.

2. **Run the script.**

       cd tools
       npm run images

   It prints one line per picture and then the `img:` lines to paste.

3. **Paste the line into `data.js`,** into the entry that certificate belongs
   to, replacing its `img: null`.

That is the whole loop. The script writes both sizes, strips the metadata, and
skips anything it has already done — so running it again after adding one new
photo takes a moment and rewrites nothing.

First time only, install the image library:

    cd tools
    npm install

## What the script does to each photo

- **Two sizes.** 400 px on the long side at quality 72 for the card, 1200 px at
  quality 82 for the lightbox. The aspect ratio is kept, and a picture that is
  already smaller than the target is never blown up — upscaling adds kilobytes
  and no detail.

- **Strips the metadata.** This is the important one. A phone photo carries a
  hidden EXIF block: camera model, exact timestamp, and on most phones the GPS
  coordinates of the spot where you took the picture — usually your home or
  your school. Once this site is deployed, anyone can pull those coordinates
  out of a published JPEG with a free tool. The script removes all of it.

  It rotates the pixels first, so portrait photos do not come out sideways
  once the orientation tag is gone.

- **Refuses a bad filename** rather than producing a URL that breaks later.
  See below.

## Rules for filenames

The filename becomes part of the public web address, so:

- lowercase Latin letters only        good: `sport-judo-2025.jpg`
- hyphens instead of spaces           bad:  `Sport Judo 2025.jpg`
- no Cyrillic                         bad:  `Дзюдо 2025.jpg`

Spaces become `%20` in a URL and Cyrillic becomes `%D0%94%D0%B7...` — ugly and
easy to break.

Case matters on the server. On Windows `Photo.JPG` and `photo.jpg` look like the
same file, but Vercel runs Linux where they are two different files. If your
image works locally and 404s after deploying, this is almost always why.

The script checks all of this before converting anything. A name it cannot use
is listed at the end of the run with the reason, and that file is left alone —
rename it in `_raw/` and run the script again.

## Suggested naming scheme

    sport-judo-city-2025.jpg
    sport-athletics-regional-2024.jpg
    olympiad-informatics-republican-2025.jpg
    project-science-fair-2025.jpg

Sorting the folder alphabetically then groups everything by category.

## Before you put a photo in _raw/

**Crop out personal data.** Diplomas often print a date of birth, an address or
an ID number. The script removes hidden metadata, but it cannot know that the
line under your name is your passport number — it will resize it and publish it
along with everything else. Once this site is deployed, anything in
`images/thumbs/` and `images/full/` is public to anyone on the internet.

Crop before, not after: `_raw/` keeps the uncropped original, and the script
overwrites the published copies from it on the next run.

You no longer need to resize by hand. That is what the script is for.

## Why `.gitkeep`

Git tracks files, not folders, so an empty folder disappears when someone
clones the repository. The empty `.gitkeep` file in each of the two folders
exists only to give git something to track, so the structure survives.
