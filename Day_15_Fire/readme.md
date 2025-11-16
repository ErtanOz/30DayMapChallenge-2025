<img width="1544" height="890" alt="image" src="https://github.com/user-attachments/assets/f22d0ebc-4525-40bc-99b7-3290a2becb6d" />



# Day 15 – Fire: Cologne Fire Stations Map

Interactive web map showing fire stations in Cologne (Köln) and their approximate response zones for the **#30DayMapChallenge 2025 – Day 15 (Fire)**.

The interface is in German and focuses on a clean, dashboard-like UX.

## Contents of this repo

- `fire_map_koeln.html` – single-page web map built with Leaflet.
- `fire_stations_koeln.geojson` – GeoJSON export of fire stations around Cologne from OpenStreetMap.

## Data source

- Source: **OpenStreetMap**, exported via **overpass-turbo**.
- License: OpenStreetMap data is available under the **ODbL**; see https://www.openstreetmap.org/copyright.
- The GeoJSON includes attributes such as:
  - `name` – station name
  - `ref` – station code (if present)
  - `operator` – operating organisation (e.g. Stadt Köln, Bundeswehr, Deutz AG)
  - `emergency` – presence of ambulance services
  - `addr:*` – address fields when available

## What the map shows

- Fire station locations across Cologne.
- Three concentric **response zones** around each station (approximate:
  - ~5 minutes → 2 km radius
  - ~10 minutes → 4 km radius
  - ~15 minutes → 6 km radius
- Summary statistics:
  - Total number of stations.
  - Number of stations with emergency services.
  - Timestamp of the dataset (from the GeoJSON `timestamp` field).

> ⚠️ **Important:** The response zones are simple distance buffers (Luftlinie), **not** real drive-time isochrones. They are only rough, illustrative approximations.

## UI / UX overview

All controls live in the glassmorphism-style panel on the left:

- **Stationen (count)** – total number of currently visible stations.
- **Rettung (count)** – number of stations with ambulance / emergency attribute.
- **Letzte Daten (date)** – date of the last OSM data export.
- **Station finden** – dropdown to zoom to a specific station and highlight it in the detail card.
- **Betreiber filtern** – filter stations by operator (e.g. Stadt Köln, Bundeswehr).
- **Response-Zonen skalieren** – slider to scale all response circles between 60% and 140% of the default radius.
- **Response-Zonen anzeigen** – toggle to show/hide the response circles.
- **Detail card** – shows name, address, operator and station code for the selected/hovered station.
- **Basemap switcher (Leaflet layers control)** – switch between CARTO Voyager, CARTO Dark, and HOT Humanitarian basemaps.
- **Legend** – explains the three ring colors and reminds that zones are approximate.

## How to run the map locally

You only need a modern browser; no build step is required.

### Recommended (avoids CORS issues)

1. Open a terminal in this folder:  
   `.../30DaysMapchallenge2025/Day_15_Fire`
2. Start a simple HTTP server, e.g. with Python:

   ```bash
   python -m http.server 4173
   ```

3. Open your browser and navigate to:

   ```
   http://localhost:4173/fire_map_koeln.html
   ```

The page will load the GeoJSON via `fetch("fire_stations_koeln.geojson")` from the same directory.

### Alternative (double-click)

You can also try opening `fire_map_koeln.html` directly from your file system (double-click).  
Some browsers block `fetch` from `file://` URLs; if the map shows no stations, use the local web server approach above.

## Technology stack

- **Leaflet 1.9.x** – interactive web mapping.
- **Basemaps:**
  - CARTO Voyager (`basemaps.cartocdn.com`)
  - CARTO Dark (`basemaps.cartocdn.com`)
  - HOT OSM (`tile.openstreetmap.fr/hot`)
- **Fonts:** Inter (Google Fonts).
- **Data:** OpenStreetMap fire stations around Cologne (GeoJSON via overpass-turbo).

## Customisation ideas

- Replace the static distance buffers with real travel-time isochrones using a routing API.
- Add thematic coloring by station type (volunteer, professional, industrial).
- Add a time-of-day selector with different assumed response coverage.
- Extend the panel with charts (e.g. number of stations per operator, per district).

