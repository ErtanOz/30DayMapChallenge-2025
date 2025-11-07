# Day 7 – Accessibility: Public Transport Spider Web (Cologne)

This folder contains my **Day 7 – Accessibility** contribution for the **#30DayMapChallenge2025**.

The idea: show how **accessible public transport in Cologne** is at a glance – using an interactive **“spider web” network map** of stops and their connections.  
Each click reveals how your chosen stop is connected to nearby stations and how dense / reachable the network around you is.

---

## 🌐 What this map shows

- **2,022+ public transport stations** in Cologne (bus, tram, rail – based on OSM data)
- **Interactive spider web visualization**:
  - Click on a station → nearby stops are highlighted as a web of connections.
  - Visual impression of how well an area is connected.
- **Adjustable accessibility radius**:
  - Control how far the “web” spreads (e.g. distance in meters).
  - Control how many nearby stations are displayed.
- **Quick info for the selected stop**:
  - See the closest neighbouring stop and distance.
- **Bonus: Weather integration** 🌦️  
  - Simple weather info is embedded as a mobility context layer:
    - Because accessibility depends not only on infrastructure, but also on current conditions.

The focus is **practical accessibility**:  
How easy is it to move through the city based on the public transport network around a single point?

---

## 🛠 Tech Stack

This map is built as a lightweight web app using:

- **HTML / CSS / JavaScript**
- **[Leaflet] or [MapLibre GL]** for interactive mapping (depending on implementation in this folder)
- **GeoJSON** for public transport stops and connections
- Optional:
  - **Overpass API** / OSM exports for station data
  - A small **weather API** for current conditions

(See code files in this directory for the exact stack and implementation.)

---

## 📁 Folder Contents

Typical files in `Day_7_Accessibility`:

- `index.html` – main web map / app
- `style.css` – map & UI styling (if separated)
- `app.js` / `script.js` – interaction logic:
  - load station data
  - handle click events
  - compute nearest stations
  - render spider web connections
- `data/stations.geojson` (or similar) – public transport stops in Cologne
- `data/`… – additional helper layers if needed

*(If filenames differ, please adjust this section accordingly.)*

---

## 🚀 How to run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/ErtanOz/30DayMapChallenge-2025.git
   cd 30DayMapChallenge-2025/Day_7_Accessibility
   ```
2. Start a simple local webserver (recommended, because of local file & CORS restrictions):

   ```bash
   # Python 3
   python -m http.server 8000
   ```

3. Open in your browser:
   ```text
   http://localhost:8000
   ```
4. Interact:
   - Click a station
   - Tune the distance / number-of-stations sliders (if available)
   - Explore how well different parts of Cologne are connected

---

## 🗺 Data Sources & Credits

- **Public transport stops & network**: OpenStreetMap contributors  
- **Weather data** (if enabled): public weather API (see source code)
- **Inspiration**: Accessibility & network visualizations from the mapping community (special thanks mentioned in comments / posts)

Data is used under the respective open data / OSM license terms.

---

## 📣 30DayMapChallenge

This project is part of **#30DayMapChallenge2025** –  
**Day 7: Accessibility** – exploring how spatial networks shape real-world mobility.

If you have ideas to improve the accessibility analysis (e.g. travel time isochrones, barrier-free routing, multimodal access), feel free to open an issue or contribute.

---
