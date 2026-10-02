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

## Never discard uncommitted work

**Do not run `git checkout --`, `git restore` or `git stash` across the whole tree, and
never on `data.js`.** Not `git checkout -- .`, not `git restore .`, not `git stash` with no
paths — including as cleanup after a temporary test edit.

This repository receives edits from outside the session. `data.js` in particular is written
directly, by hand and by other tools, between one message and the next. A tree-wide discard
throws that work away silently: the file goes back to HEAD, and nothing in the output says
a foreign edit was destroyed.

The one incident behind this rule is explained, and it was not git. The site owner's
assistant reused a single output filename through a relay that served back a stale copy, so
an older `data.js` was written over a newer one. No git command and no Claude Code session
discarded anything. The rules below stand anyway — outside edits are real and a discard is
still unrecoverable — but the cause is known, not an open mystery to re-investigate.

To undo your own experiment, revert the specific lines you wrote, or name the exact file you
touched. Prefer not writing the experiment to disk at all — a temporary change made to test
rendering belongs in the browser's page memory, not in a tracked file.

When in doubt, run `git status`, show it, and ask. Discarding is not recoverable; asking
costs one message.

The rule is the effect, not the command name. `git reset --hard`, `git clean -fd`,
`git checkout <branch>` and `git switch` are forbidden here for the same reason: **anything
that can replace a tracked file's contents with an older version, or remove a file you did
not write, is a discard**, whatever it is called.

The same damage happens with no git command at all. `data.js` may be edited by the site
owner's assistant between your read and your write, so rewriting the whole file from content
you read earlier silently drops whatever arrived in between. Never rewrite `data.js`
wholesale: re-read it immediately before touching it, and edit specific lines only. Better
still, do not write to `data.js` at all — you may read it, and you may `git add` and
`git commit` it. Editing it is not your job.

### The one exception: /intake

The blanket "do not write to `data.js`" above stands, with exactly one exception: the
`/intake` command in `.claude/commands/intake.md`. Working under that command you may
**append** new entries — and only append:

- Re-read `data.js` immediately before writing, every time, so you are appending to what is
  on disk now and not to a copy you read earlier in the session.
- Insert whole new objects at the end of a category block, or at the end of the array.
- Never modify, reformat or reorder an existing line, and never rewrite the file wholesale.

Everything else about `data.js` is unchanged. Outside of `/intake` you may read it, `git add`
it and `git commit` it, and that is all.

If you need a clean tree before committing, commit `data.js` alone, in its own commit, and
say what was in it. Never discard to get a clean tree.

## Do not add

- analytics or tracking of any kind
- external fonts other than Google Fonts
- any CDN script
