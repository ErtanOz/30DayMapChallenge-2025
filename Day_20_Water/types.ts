export interface FloodReport {
  level: number;
  text: string;
  timestamp: string;
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED'
}

export interface Landmark {
  name: string;
  lat: number;
  lng: number;
  elevation: number; // Approximate relative elevation for simulation logic
}

// Extending Window to include Leaflet global
declare global {
  interface Window {
    L: any;
  }
}