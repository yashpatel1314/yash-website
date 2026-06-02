# Portfolio Redesign — Signal + Depth

**Date:** 2026-06-01  
**Status:** Approved  
**Author:** Yash Patel (via brainstorming session)

---

## Goal

Redesign the portfolio homepage and supporting pages so that:
1. A cold-landing recruiter can assess seniority and fit in under 8 seconds.
2. A hiring manager who has already seen the resume can find technical depth quickly.
3. The site clearly positions Yash as a **robotics/autonomy engineer** with a credible mechanical engineering secondary.

The current site's core problems: hero title is generic ("Hello!"), 6 internships are buried in the About page, no resume download link, metrics and seniority signals are absent from the homepage.

---

## Scope

Three existing pages are redesigned in place. No new pages. No framework changes — the stack remains plain HTML/CSS/JS.

| Page | Change level |
|------|-------------|
| `index.html` | Full redesign |
| `projects.html` | Card layout improvement only; filter/search/modal logic untouched |
| `about.html` | Add "currently looking for" callout at top; rest unchanged |

---

## Visual Language

### Aesthetic direction
**Dark + engineering texture.** The dark navy base is preserved. Engineering identity is expressed through:
- A subtle SVG hexagonal grid tiled across the hero at ~4% opacity, with a slow CSS drift animation.
- Horizontal "circuit trace" dividers between sections (thin line + filled-circle nodes at intervals).
- Small `CAPS / 11px / tracked` overline labels before each section heading.

### Color palette

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0b1020` | Page background |
| `--bg-soft` | `#0f172a` | Card background |
| `--brand` | `#7c3aed` | Purple — primary accent, CTAs |
| `--brand-2` | `#22d3ee` | Cyan — secondary accent, metrics |
| `--engineering` | `#1e3a5f` | New — blueprint-blue for texture elements |
| `--text` | `#e5e7eb` | Body text |
| `--muted` | `#94a3b8` | Secondary text |
| `--border` | `#23314d` | Borders |

Light mode tokens and the dark/light toggle are preserved unchanged.

### Typography
Font family stays as Inter. Changes are in the usage:
- Hero name: `64px`, weight `800` (up from `46px "Hello!"`)
- Section overlines: `11px`, `700` weight, uppercase, `2px` letter-spacing, color `--brand-2`
- All other sizing/weight rules unchanged

### Animations
Two additions only — no scroll libraries, no JS animation frameworks:
- **Animated counters:** Metrics card numbers count from 0 to their target value on page load (pure JS, ~20 lines).
- **Hex grid drift:** The hero background hex SVG pans slowly via `@keyframes` CSS transform. No JS.

---

## Homepage — Section-by-Section

### 1. Navigation (sticky)

Same as current with one addition: a **Resume** link in the nav that downloads the PDF.

```
YP    Home  Projects  About  Resume↓         ☀/🌙
```

### 2. Hero

**Left column:**
```
MECHATRONICS ENGINEER          ← overline, 11px caps, --brand-2
Yash Patel                     ← 64px, 800 weight
Robotics · Autonomy · UWaterloo  ← muted, 18px

● Open to full-time roles      ← green dot + small badge

[View Projects]  [Resume ↓]   ← primary + outline CTAs
```

**Right column (stacked):**

Top card — metrics:
```
┌─────────────────────────────────┐
│  6          4th year    3       │
│  Internships  Engineer  Disciplines│
└─────────────────────────────────┘
```
Numbers animate (count up) on page load. Labels are muted text below each number.

Bottom card — project photo:
```
┌─────────────────────────────────┐
│                                 │
│   [best project photo]          │
│                                 │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← dark gradient overlay
│ WatDig — 1st Place NABC 2024   │ ← caption, white text
└─────────────────────────────────┘
```
Image uses `border-radius: 12px` and a subtle `box-shadow` with purple tint. Caption is positioned absolutely at the bottom with a `linear-gradient` overlay from transparent to `rgba(0,0,0,0.7)`.

**Hero background:** SVG hex grid at 4% opacity, slow CSS pan animation.

**Grid:** Left column is `1.2fr`, right is `0.8fr`. Stacks to single column on mobile (right column moves below left).

### 3. Circuit Trace Divider (reusable component)

```html
<div class="circuit-divider">
  <!-- rendered as: ── ●─────── ●─────── ●─────── ●── -->
</div>
```

CSS-only using `::before`/`::after` on child spans. Used between hero/experience, experience/skills, skills/projects.

### 4. Experience Strip

Horizontal timeline. Six entries (all internships) displayed on the circuit trace line, most recent rightmost.

Each entry:
- **Company name** — `600` weight, above the line
- **Role title** — muted, below the line  
- **Date range** — `12px`, muted, below role

```
── ●──────────── ●──────────── ●──────────── ●──────────── ●───── ●──
   Welbilt       Welbilt       WatDig        WatDig        Sable  Sable
   Mfg Eng       Mfg Eng II    Robotics      Robotics II   Eng    Eng II
   Jan–Apr 23    Sep–Dec 23    Jan–Apr 24    May–Aug 24    ...    ...
```

Strip header: `EXPERIENCE` overline + `View full timeline →` link to About page.  
On mobile: horizontally scrollable, nodes keep their fixed width.

### 5. Skills Clusters

Three columns with a colored left-border accent. No progress bars — plain text tags.

| Column | Border color | Content |
|--------|-------------|---------|
| ROBOTICS & AUTONOMY | `--brand` (purple) | ROS2, C++, Python, SLAM, Path Planning, Sensor Fusion, UWB, Real-time GUIs |
| MECHANICAL DESIGN | `--brand-2` (cyan) | SolidWorks, AutoCAD, Sheet Metal, GD&T, Fixtures, Technical Drawings, Rapid Prototyping |
| WEB & SOFTWARE | `--muted` | React, JavaScript, Full-stack, REST APIs, Node, Python |

Section overline: `DISCIPLINES`. Collapses to single column on mobile, mechanical and web clusters collapse first.

### 6. Recent Projects (3 cards)

Same data source and JS logic. Card layout updated:

```
┌─────────────────────────────┐
│ [thumbnail image — 160px]   │
├─────────────────────────────┤
│ WatDig                  (org)│
│ 2024 Navigation Challenge   │
│ [ROS2] [SLAM] [Python]      │
│ Oct 2024 — Apr 2025         │
│                             │
│ [Details →]    [Repo]       │
└─────────────────────────────┘
```

Description text moves to modal only — cards are scannable, not readable. If no image exists for a project, card shows a placeholder with the org name and a subtle hex pattern background.

Section overline: `SELECTED WORK`. `View all →` link preserved.

### 7. Footer

Unchanged structurally. Add resume download link alongside the social icons.

---

## Projects Page

No structural changes. Three card-level updates:

1. Thumbnail image shown at top of card (160px height, `object-fit: cover`)
2. Description removed from card face — modal only
3. Tags rendered as styled chips (already done) — confirmed kept

Filter, search, sort, and modal system: **no changes.**

---

## About Page

One addition at the top of the page, before the profile section:

```
┌──────────────────────────────────────────────────┐
│ ● Currently seeking full-time roles in           │
│   robotics, autonomy, and mechatronics           │
│   engineering — available [fill in: e.g. Aug 2026]│
│                                    [Resume ↓]   │
└──────────────────────────────────────────────────┘
```

Green dot, border matches `--brand`, subtle background tint. Content is hardcoded (not data-driven).

---

## What Is Explicitly Not Changing

- HTML/CSS/JS stack — no framework introduced
- Font family (Inter)
- Dark/light theme toggle and all light-mode CSS vars
- Border radius system (`--radius: 14px`)
- Projects JSON data format and loading logic
- Modal system
- Carousel system
- Mobile nav (hamburger)
- Footer social links

---

## Open Questions Resolved

| Question | Decision |
|----------|----------|
| Experience strip on homepage? | Yes — company names + roles, links to About for full timeline |
| Hero right side? | Metrics card (top) + project photo with caption overlay (bottom) |
| Progress bars for skills? | No — plain text tags, more scannable and confident |
| Aesthetic direction | Dark + engineering texture (hex grid, circuit trace dividers) |
| Primary role target | Robotics/autonomy, mechanical as visible secondary |
