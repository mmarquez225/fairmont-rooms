# Fairmont Rooms — Project Notes

## What this is

An interactive 3D floor plan for the Fairmont Hotel San Francisco. The main working file is `project/Booked Rooms.html`. The schematic floor plan files (`Floor Plan.html`, `Floor Plan (full).html`) are not being used.

## How to run

```bash
cd /Users/mmarquez/Downloads/fairmont-rooms/project && python3 -m http.server 8080
```

Then open: http://localhost:8080/Booked%20Rooms.html

**Always hard refresh (Cmd+Shift+R) after code changes** — browser caches aggressively.

## How it works

`Booked Rooms.html` loads `uploads/3D Floorplans.svg` inline via `fetch()`, then uses `document.elementsFromPoint()` to match each room to its cream-filled path (`fill="#f1e7d3"`) in the SVG. Checking a room checkbox highlights that path with solid `#e09663`.

### Hint points (ROOMS array)

Each room has an `x, y` hint in SVG viewBox coordinates (0–648, 0–864). The JS converts these to page pixels using the SVG's `getBoundingClientRect()` and calls `elementsFromPoint` with a spiral search (±50px) to find the correct cream path.

Rooms can have an `extra: [{x, y}]` array for rooms made of multiple separate cream paths (e.g. Roof Garden has an oval in the middle).

### Coordinate picker tool

A "Coordinate picker" checkbox is built into the page (bottom of the stage area). Enable it, click anywhere on the SVG, and the x/y coordinates appear in SVG viewBox units. Use these to update hint points in the ROOMS array.

## Current room status

### Working ✓
- The Crown Room
- State Room
- International Room
- Far East Room
- California Room
- Hunt Room
- Roof Garden (+ oval extra)
- Fountain Room
- Pavilion Room
- Venetian Room
- French Room (+ bottom-right extra at 411, 252)
- Cirque Room (+ extras)
- Gold Room (+ corner extras)
- Intersect
- Tonga Restaurant
- Laurel Court (merged restaurant + bar into one entry)
- Empire Room
- Green Room
- Garden Room
- TERRACE ROOM (name all caps per request)
- Vanderbilt Room
- Grand Ballroom

### Needs work ⚠️
- **Crystal Room** — no match found yet; cream-fill path not located. May not have a visible isolated face in this SVG.
- **Diplomat Club** — keeps highlighting the wrong area (x:306, y:434) regardless of hint. The room appears to share a large cream background path with the adjacent corridor. Last tried hint: x=386, y=441.

## SVG notes

- File: `project/uploads/3D Floorplans.svg` — do NOT modify this file directly
- The SVG has `xmlns:inkscape` redefined in a `<g>` which causes a browser XML error when opened directly, but works fine when loaded via `fetch()` + `innerHTML`
- Room text labels use `transform="matrix(1 0 0 1 0 864)"` — convert tspan y to screen: `screen_y = 864 + tspan_y` (tspan y values are negative)
- Many rooms have callout lines connecting their labels to their actual face positions — the room face is at the START of the callout line, not at the label

## Key CSS

```css
--booked-glow: #e09663;  /* solid color for consistent highlight */
```

Hover also uses `#e09663`. Previously used semi-transparent rgba which caused color inconsistency across different path backgrounds.

## Laurel Court text fix

After SVG loads, JS hides the "RESTAURANT" text element and the "BAR" tspan so the map shows only "LAUREL COURT" for both areas. The SVG file is unchanged.
