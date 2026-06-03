# Yash Patel — Portfolio

Personal portfolio for Yash Patel, 4th-year Mechatronics Engineering student at the University of Waterloo. Built to target full-time roles in robotics and autonomy.

## What it covers

**Home** — Hero with animated metrics (6 internships, 2 competition wins, 3 disciplines), open-to-work badge, experience timeline of all 6 co-ops, discipline-grouped skills, and recent projects.

**Projects** — 12 projects across robotics, mechanical design, and software. Cards show a one-line outcome, stack tags, and date. Filterable by discipline (Robotics / Mechanical / Software). Each card opens a modal with full bullet-point breakdown and image carousel where available.

**About** — Profile, full experience timeline, skills breakdown, and education.

## Stack

Plain HTML, CSS, and JavaScript — no build step, no framework. Dark/light theme toggle, responsive layout, accessible modal with focus trap and keyboard navigation.

## Files

- `index.html` — Home
- `projects.html` — Projects with discipline filters and modal
- `about.html` — About / experience / skills
- `assets/css/style.css` — All styles
- `assets/js/main.js` — Theme, nav, metric counters, home project cards
- `assets/js/projects.js` — Projects filter, search, card render, modal, carousel
- `assets/data/projects.json` — Project data (add `outcome`, `stack`, `tags`, `images`, `longDescription`)
- `assets/resume_robotics.pdf` — Robotics & Autonomy resume
- `assets/resume_mechanical.pdf` — Mechanical resume
- `assets/resume_joint.pdf` — Joint resume
