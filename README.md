# Leskhan Uais - Portfolio

A personal achievements portfolio: diplomas and certificates from sport
competitions, academic olympiads and project contests.

Plain HTML only for now. No CSS, no JavaScript, no build step.

## Files

    index.html      English version. This is the page a server shows at "/"
    ru.html         Russian version. Same structure, same ids, translated text
    images/         your diploma and certificate pictures
    .gitignore      files git should ignore

Both HTML pages share the same `images/` folder and the same section ids
(`#about`, `#sport`, `#olympiads`, `#projects`, `#contact`). That means one
future stylesheet will style both languages with no extra work.

## How to view it

Double-click `index.html`. It opens in your browser. There is nothing to
install and no server to run - that is the advantage of a static site.

## How to add an achievement

1. Put the picture in `images/` (see `images/README.md` for the naming rules).
2. Open `index.html` in a text editor.
3. Find the section you want (`<section id="sport">`, etc).
4. Copy one whole `<article class="achievement"> ... </article>` block.
5. Paste it below the original and edit: heading, date, description, and the
   `src` / `alt` / `width` / `height` of the `<img>`.
6. Do the same in `ru.html` so both languages stay in sync.

## How to check your work

- Click every link in the top navigation - each should jump to its section.
- Click the language link both ways.
- Open `ru.html` and confirm Russian text renders correctly. If you see
  `????` or `Ð Ñ€Ð¸`, the `<meta charset="UTF-8">` line is missing or wrong.
- Break an image `src` on purpose and reload - you should see the `alt` text.
  That is what a blind visitor hears, so make sure it reads like a sentence.
- Validate the HTML at https://validator.w3.org/#validate_by_input
  Paste the file contents in. Aim for zero errors.

## Deploying to Vercel (later)

Not done yet. When you are ready, either:

**Route A - GitHub (recommended)**

    git init
    git add .
    git commit -m "Initial portfolio"
    git branch -M main
    git remote add origin https://github.com/YOUR-NAME/portfolio.git
    git push -u origin main

Then go to vercel.com, sign in with GitHub, click "Add New Project", import
the repo, and press Deploy. No settings to change: Vercel detects a static
site, finds `index.html`, and serves it at the root. Every later `git push`
redeploys automatically.

**Route B - CLI**

    npx vercel

Answer the prompts. Use `npx vercel --prod` for the production URL.

## Roadmap

- [ ] Replace all EXAMPLE / REPLACE placeholder text with real content
- [ ] Add real certificate images
- [ ] CSS styling
- [ ] Scroll animations and transitions between sections
- [ ] Deploy to Vercel

## Note on the comments in the HTML

`index.html` contains long teaching comments explaining each tag. They are
invisible to visitors but readable by anyone who presses Ctrl+U on the live
site. Before the final public deploy you may want to strip them - keep a
commented copy for studying.
