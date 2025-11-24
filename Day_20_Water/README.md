<img width="1916" height="1027" alt="image" src="https://github.com/user-attachments/assets/b687fb80-23d2-4445-ab1c-6a0d9daf0ca1" />


# Day 20, Water, Cologne Flood Risk Simulation

This folder is part of the **#30DayMapChallenge2025** series.  
It contains a small experimental web app that simulates potential flood scenarios for the River Rhine in Cologne.

The focus is not on scientific accuracy, but on exploring how interactive maps, synthetic data and open geo data can be combined to tell a story about urban flood risk.

---

## Concept

Cologne is regularly affected by high water. The city has a strong crisis management center with multidisciplinary experts. This app plays with the idea of a simple **flood risk cockpit**:

- Historical information and a bit of GeoJSON data for the Rhine
- Synthetic water level scenarios for different flood stages
- Visual feedback on which areas might be affected

The project is open and experimental. It can be used as a starting point for more serious GeoAI and crisis management prototypes.

---

## Features

- Interactive web map of Cologne and the River Rhine  
- Simple flood level scenarios with visual changes on the map  
- Synthetic sample data, no real time connection to official gauges  
- Lightweight, easy to fork and adapt for your own city or use case  

---

## Data

- Base geography, river geometry and city context are based on open geodata  
- Flood levels and affected areas are **partly synthetic** and simplified  
- Do not use this app for real world emergency decisions

If you extend this project, please document your own data sources clearly.

---

## How to use

1. Clone the repository and navigate to this folder:

   ```bash
   git clone https://github.com/ErtanOz/30DayMapChallenge-2025.git
   cd 30DayMapChallenge-2025/Day_20_Water


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
