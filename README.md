# Random Quote Generator

A small, dependency-free web app that displays random inspirational quotes. Built with
plain HTML, CSS, and vanilla JavaScript — no build step or package manager required.

## Features

- Random quote generation with a **New Quote** button
- Filter quotes by category (Action, Courage, Philosophy, and more)
- Previous-quote navigation and a **History** panel of recently viewed quotes
- **Copy** the current quote to the clipboard
- Light/dark mode toggle and five color themes, persisted via `localStorage`

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and element hooks |
| `script.js` | Quote data and all interactive behavior |
| `styles.css` | Styling, themes, and animations |

## Running locally

The app is fully static, so any static file server works. Using Python's built-in server:

```bash
python3 -m http.server 3000
```

Then open http://localhost:3000 in your browser.

Alternatively, with Node.js:

```bash
npx serve -l 3000
```

## Cloud Agent environment

This repository includes a [`.cursor/environment.json`](.cursor/environment.json) that
configures the Cursor Cloud Agent development environment. It starts the static server on
port 3000 in a persistent terminal named `web`, so the app is available at
http://localhost:3000 as soon as an agent boots.
