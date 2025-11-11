
![Uploading image.png…]()



# Cologne Air & Water Monitor  
Day 10: AIR, part of **#30DayMapChallenge2025**

A modern, React based dashboard for **Cologne environmental monitoring**.  
The app visualisiert Luftqualität, Wasserstand und Wetterdaten für Köln in einem kompakten Interface.  
Zusätzlich ist ein experimenteller **AI Assistant (Gemini)** integriert, der Nutzerfragen zu den angezeigten Daten beantwortet.

> Dieses Projekt basiert auf einem AI Studio Template und wurde für das AIR Thema angepasst.

---

## 🚀 Features

- Single Page App mit moderner UI, Tailwind Look and Feel.
- Interaktive Karte mit **Leaflet** und **Heatmap Layer** (leaflet.heat).
- Darstellung von Messpunkten und räumlichen Mustern.
- Zeitliche Verläufe und Kennzahlen mit **Chart.js**.
- AI Assistant auf Basis von **Google Gemini**:
  - Fragen zu Luft, Rhein, Wetter und Umweltdaten.
  - Konfiguration über eigenen API Key.
- Struktur für saubere Trennung von:
  - UI Komponenten.
  - API Service Layer.
  - Konstanten, Typen und Config.

---

## 🧱 Tech Stack

**Frameworks und Libraries**

- [React](https://react.dev) mit TypeScript.
- [Vite](https://vitejs.dev) als Build und Dev Server.
- [Tailwind CSS](https://tailwindcss.com) via CDN Konfiguration im `index.html` für schnelles Styling.
- [Leaflet](https://leafletjs.com) für Karten.
- `leaflet.heat` für Heatmap Darstellung.
- [Chart.js](https://www.chartjs.org) plus `chartjs-adapter-date-fns` für Zeitreihen.
- `@google/genai` zur Anbindung von Gemini (AI Assistant).

**Projekt Setup**

- AI Studio kompatible Struktur.
- Environment Konfiguration über `.env.local`.
- TypeScript Konfiguration über `tsconfig.json`.
- Vite Konfiguration über `vite.config.ts`.

---

## 🗂 Projektstruktur

```text
Day_10_AIR/
├── .env.local           # API Keys und Konfiguration (lokal, nicht commiten)
├── .gitignore
├── index.html           # Entry HTML, Tailwind Setup, Importmap
├── index.tsx            # React Einstiegspunkt, Render in #app
├── App.tsx              # Hauptlayout und Routing/Sections
├── constants.ts         # Konstante Werte, Texte, Konfiguration
├── types.ts             # TypeScript Typen für Datenstrukturen
├── vite.config.ts       # Vite Build Konfiguration
├── tsconfig.json        # TypeScript Konfiguration
├── metadata.json        # AI Studio / App Metadaten
├── package.json         # Dependencies und Scripts
├── components/          # Wiederverwendbare UI Komponenten
│   ├── ...              # z.B. Map, Sidebar, Cards, Charts, AI Panel
├── services/            # API und Datenlogik
│   ├── ...              # z.B. airQualityService, waterLevelService, weatherService
└── .vscode/             # Optionale Editor Settings
Die genaue Aufteilung der Komponenten und Services folgt dem Prinzip:
UI in components, Datenzugriff in services, zentrale Konfiguration in constants und types.

🌐 Datenquellen und APIs
Die App ist dafür ausgelegt, folgende Informationen zu kombinieren:

Luftqualitätsdaten für Köln.

Rheinpegel Daten.

Wetterdaten.

Kartendaten auf Basis von OpenStreetMap Tiles mit Leaflet.

Die konkreten Endpunkte werden im services Verzeichnis implementiert.
Typischer Ablauf:

Frontend ruft Funktionen aus services auf.

Services holen Daten von Open Data oder Wetter/Luft API.

Daten werden in Kartenlayern, Kartenkarten und Charts visualisiert.

Der AI Assistant nutzt die aufbereiteten Daten für Kontext in Antworten.

Passe die genutzten APIs und Keys an deine Umgebung an, je nach gewählter Datenquelle und Lizenz.

🔑 Environment Variablen
In .env.local:

bash
Code kopieren
GEMINI_API_KEY=dein_gemini_api_key
Optional kannst du weitere Variablen ergänzen, zum Beispiel für öffentliche Endpunkte oder Proxys.
.env.local darf nicht eingecheckt werden.

🧪 Entwicklung lokal starten
Voraussetzung: Node.js

bash
Code kopieren
# Dependencies installieren
npm install

# Dev Server starten
npm run dev
Danach im Browser öffnen:

text
Code kopieren
http://localhost:5173
oder die von Vite ausgegebene URL.

📦 Build und Deployment
bash
Code kopieren
npm run build
npm run preview
Das erzeugte dist Verzeichnis kann auf jedem statischen Hoster oder innerhalb von AI Studio bereitgestellt werden.

🔒 Sicherheit
Keine Secrets im Code eintragen.

AI Funktionen nur mit eigenem Key und möglichst über Backend oder Proxy nutzen.

Die App ist ein Demo und Lernprojekt, kein offizielles Warn oder Monitoring System.

🙌 Credits
Idee und Implementierung im Rahmen von #30DayMapChallenge2025 Day 10: AIR.

Daten basieren auf offenen Datenquellen und APIs, bitte jeweil



src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6"

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oZO-Ty3dJLfIDDtRqUNkButHO24xj1kj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
