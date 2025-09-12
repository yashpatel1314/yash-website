# Yash Patel • Technical Portfolio

Static site with Home, Projects, and About pages. Includes dark/light theme, responsive layout, dynamic projects with filters/search/sort, and accessible modal.

## Run locally

Use any static server. Examples:

- VS Code Live Server
- Python: `python -m http.server 5173`
- Node: `npx serve . -l 5173`

Then open `http://localhost:5173`.

## Structure

- `index.html` – Home
- `projects.html` – Projects (dynamic)
- `about.html` – About
- `assets/css/style.css` – Global styles
- `assets/js/main.js` – Navigation, theme, utilities
- `assets/js/projects.js` – Projects filtering/search/sort + modal
- `assets/data/projects.json` – Project data

## Customize

- Update `assets/data/projects.json` with your projects
- Replace `favicon.svg` and social links in footers
- Optionally add an OpenGraph image at `assets/images/og.png`

