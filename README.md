# Portfolio-Sarika

A clean, single-page resume website for Sarika S Shirolkar. This is a static site (plain HTML/CSS/JS) designed to be deployed on GitHub Pages.

## Live Site

After GitHub Pages is enabled, the site will be available at:

- `https://sarikashirolkar.github.io/Portfolio-Sarika/`

## What's Included

- `index.html`: main page content (resume sections)
- `styles.css`: layout + typography + responsive styling
- `script.js`: lightweight scroll reveal + active section highlighting
- `resume.pdf`: downloadable resume used by the page

## Run Locally

Open `index.html` directly in a browser, or run a local server (recommended):

```sh
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Deploy To GitHub Pages

1. In the GitHub repo, go to `Settings` -> `Pages`.
2. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
3. Save and wait for GitHub to publish the site.

## Update Content

- Edit resume content: `index.html`
- Update styling/theme: `styles.css`
- Replace resume PDF: overwrite `resume.pdf` (keep the same filename so the button keeps working)

## License

All rights reserved (unless you choose to add an open-source license).

