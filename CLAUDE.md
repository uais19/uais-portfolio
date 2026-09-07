# Project rules

## What this is

A static personal portfolio site: plain HTML, CSS and vanilla JS.
No build step, no framework, no npm dependencies. It deploys to Vercel as static files.

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
