
<img width="1372" height="915" alt="Screenshot 2025-11-26 150641" src="https://github.com/user-attachments/assets/fb3348d4-69d0-437c-973d-9893a72b0847" />

🚚 Cologne Transportation Navigator (Agrippa Logistic)

A GeoAI‑powered WebMap for vehicle‑aware navigation in narrow historic streets of Cologne.

This project blends classic GIS, OpenStreetMap data, and modern GeoAI techniques to support urban logistics, routing, and spatial decision‑making in complex environments.

🌍 Project Overview

Historic cities like Cologne have tight medieval streets that make truck navigation difficult. This WebMap helps drivers and planners by combining:

Vehicle‑dimension‑aware street suitability

OSRM‑based routing

Live traffic intelligence

AI‑driven geospatial reasoning

It was originally created as part of the #30DayMapChallenge2025 – Day 26 (Transportation).

🤖 GeoAI Capabilities (Core Innovation)

This WebMap goes beyond traditional GIS and integrates GeoAI for smart geospatial reasoning:

1. Context‑Aware Insights

Street width values are interpreted relative to the selected vehicle. Example:

"3.5m width → too narrow for heavy trucks."

2. Predictive Traffic Modeling

The AI generates a simplified congestionCurve showing how traffic might evolve over time at a specific location.

3. Live Traffic Intelligence

The app fetches real‑time text from the web (news, traffic reports) and summarizes it for the selected area.

🗺️ Geospatial Techniques Used
1. Geocoding & Reverse Geocoding

Forward: Convert street names (e.g., Severinstraße) → coordinates (Nominatim).

Reverse: Click on map → Overpass API returns nearest road + attributes.

2. Network Analysis (Routing)

OSRM computes efficient paths using A* / Contraction Hierarchies.

Returns route geometry + street names.

3. Proximity Analysis (Buffering)

Small buffer (~20 m) finds the nearest street.

Large buffer (~1000 m) collects full street geometry without mixing similar names.

4. GIS Overlay & Visualization

Vector overlays for markers, routes, street segments.

Thematic styling (green = suitable, red = unsuitable).

🔍 Mini‑List: Core GeoAI Intelligence

Contextual road suitability analysis

Spatio‑temporal traffic prediction

Real‑time unstructured traffic data summarization

Smart geocoding, routing & proximity analytics

Thematic GIS visualization guided by AI insights

🛠️ Tech Stack

Frontend: React / TypeScript

Map Rendering: Leaflet or MapLibre

Base Maps: CARTO Dark / OpenStreetMap

Routing Engine: OSRM

Geocoding: Nominatim

Vector Queries: Overpass API

GeoAI: Gemini LLM (contextual + predictive reasoning)

📦 Installation
git clone <your-repo-url>
cd cologne-transportation-navigator
npm install
npm run dev

Open http://localhost:3000

📬 Contact

To access the interactive map online, send me a message — I’ll share the link privately.

🏷️ Tags

#GIS #GeoAI #UrbanLogistics #SmartCity #OSM #Mapping #Transportation #Cologne #OpenData
