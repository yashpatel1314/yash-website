# Projects Page Redesign

**Date:** 2026-06-02  
**Status:** Approved

## Goal

Make the projects page scannable and professional. A recruiter should be able to read all 11 projects in 30 seconds and know what was built, where, and what the outcome was — without clicking into a single modal.

## Card Structure (Approach A — Refined 3-Column Grid)

```
┌─────────────────────────────────────┐
│ 3px left border (discipline color)  │
│  WATDIG                             │  ← org, 11px uppercase muted
│  2024 Navigation Challenge          │  ← project name, bold
│                                     │
│  1st place · 94% accuracy           │  ← outcome line, brand-2 color
│                                     │
│  [ROS2] [SLAM] [Python] [UWB]       │  ← stack chips, max 4
│  Oct 2023 – Apr 2024    [Details →] │  ← date + single action
└─────────────────────────────────────┘
```

**Discipline border colors:**
- Robotics → `--brand` (purple)
- Mechanical → `--brand-2` (cyan)
- Software → subtle muted border

**Discipline detection** (from `tags` array):
- Robotics: `robotics, ros2, slam, uwb, navigation, tbm, vfd, automation, competition, ev3, robotc`
- Mechanical: `solidworks, sheet-metal, mechanical-design, manufacturing, inventor, safety, 3d-printing, onshape`
- Software: everything else

**Outcome line** — stored as `outcome` field in `projects.json`. Falls back to first sentence of `description`.

## Filter Bar

```
[search input]  [All] [Robotics] [Mechanical] [Software]
```

- 4 discipline pill buttons replace the 20+ raw tag chips
- One active at a time
- Search bar kept
- Sort dropdown removed (default: most-recent-first, unchanged)

## Page Header

```
SELECTED WORK   ← overline (matches homepage)
Projects        ← h1
```

## Removed

- ★ star ratings (card and modal)
- Sort dropdown
- Raw tag filter chips
- Description paragraph on card face
- Repo button on card face (modal only)

## Unchanged

- Modal system, carousel, keyboard nav, focus trap
- 3-column responsive grid
- `projects.json` data format (only adds `outcome` field)
- Search functionality
