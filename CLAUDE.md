# Project rules

## What this is

A static personal portfolio site: plain HTML, CSS and vanilla JS.
No build step, no framework, no npm dependencies. It deploys to Vercel as static files.

## The one npm exception: tools/

`tools/` is a local developer tool and is **not part of the site**. It has its own
`package.json` with `sharp` as a devDependency, and `tools/make-images.mjs` resizes the
photos in `_raw/` into `images/thumbs/` and `images/full/`.

This does not break the "no npm dependencies" rule above, because that rule protects what
ships: no HTML file loads anything from `tools/` or `node_modules/`, there is still no
build step, and Vercel still deploys plain static files. The `package.json` sits inside
`tools/` rather than at the project root specifically so that Vercel never sees it.

Do not delete `tools/` as a rule violation. Resizing every scan twice by hand and
remembering to strip EXIF each time is the thing that actually fails — a phone photo
carries GPS coordinates, and this archive is public. Keep the rule and this exception
together: anything new under `tools/` must stay invisible to the deployed site.

## Design

`DESIGN.md` is the single source of truth for colors, fonts and layout decisions.
Read it before any styling work. Never introduce a color that is not a CSS variable
defined there.

`design-preview.html` is an approved visual prototype. When implementing a section, port
the markup, CSS and JS from it rather than inventing new styling.

## The two language files

`index.html` is the English version, `ru.html` is the Russian one. They share section ids
and the same stylesheet. Any structural change must be applied to both files in the same
commit.

## Teaching comments

`index.html` contains long teaching comments explaining each tag. Keep them. Add a short
comment in the same style when you introduce a new pattern.

## Working rhythm

Work in small steps: one section per commit, and stop after each step so the change can be
checked in a browser.

## Do not add

- analytics or tracking of any kind
- external fonts other than Google Fonts
- any CDN script
