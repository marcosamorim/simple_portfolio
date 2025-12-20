# Simple Portfolio

A lightweight, single-page portfolio built with plain HTML, CSS, and JavaScript.
It is data-driven via `data.json` and designed to be fast and easy to customize.

## Highlights
- Single page, no build step
- Content managed in `data.json`
- Local icon assets and clean link buttons
- Responsive layout for desktop and mobile

## Project Structure
- `index.html` - page markup
- `styles.css` - styling
- `script.js` - rendering logic
- `data.json` - content (name, about, links, projects)
- `assets/` - images, PDFs, and icons

## Customize Content
Edit `data.json`:
- `name`, `tagline`, `location`, `current`
- `about` text (supports blank lines for paragraphs)
- `links` list (label + url)
- `skills` list
- `projects` (name, description, tags, and links)

## Run Locally
Open `index.html` directly in a browser.

If you prefer a local server:
```sh
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy
This project is static and can be deployed on any static host
(e.g., Cloudflare Pages, GitHub Pages, Netlify).
