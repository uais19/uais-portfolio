# images/

Put your diploma and certificate pictures in THIS folder.

## Rules for filenames

The filename becomes part of the public web address, so:

- lowercase Latin letters only        good: sport-judo-2025.jpg
- hyphens instead of spaces           bad:  Sport Judo 2025.jpg
- no Cyrillic                         bad:  Дзюдо 2025.jpg
- keep the extension (.jpg / .png)

Spaces become %20 in a URL and Cyrillic becomes %D0%94%D0%B7... - ugly and
easy to break.

Case matters on the server. On Windows `Photo.JPG` and `photo.jpg` look like
the same file, but Vercel runs Linux where they are two different files. If
your image works locally and 404s after deploying, this is almost always why.

## Suggested naming scheme

    sport-judo-city-2025.jpg
    sport-athletics-regional-2024.jpg
    olympiad-informatics-republican-2025.jpg
    project-science-fair-2025.jpg

Sorting the folder alphabetically then groups everything by category.

## Before you add a picture

1. Resize it. A phone photo is 4-6 MB and will make the page load slowly.
   Target roughly 1200 px on the long side, under 500 KB.
   Windows: right-click > Open with > Paint > Resize.

2. Crop out personal data. Diplomas often print a date of birth or an ID
   number. Once this site is deployed, anything in this folder is public to
   anyone on the internet.

3. Prefer .jpg for photos of paper documents, .png for screenshots.

## Then tell Claude "images are in"

Claude can read this folder, list the files, and write the matching <img>
tags into index.html and ru.html for you. You do not need to send the
pictures anywhere.
