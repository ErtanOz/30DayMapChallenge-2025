import { Coordinates } from './types';

export const CONFIG = {
  DEMO_FALLBACK_ENABLED: true,
  PEGEL_REFRESH_MINUTES: 10,
  PEGEL_STATION_ID: 'a6ee8177-107b-47dd-bcfd-30960ccc6e9c',
  API_ENDPOINTS: {
    air: 'https://air-quality-api.open-meteo.com/v1/air-quality',
    weather: 'https://api.open-meteo.com/v1/forecast',
    pegelonline: 'https://pegelonline.wsv.de/webservices/rest-api/v2/stations',
  },
  DEFAULT_LOCATION: {
    latitude: 50.9375,
    longitude: 6.9603,
  },
  AUTO_REFRESH_MS: 5 * 60 * 1000, // 5 minutes
};

export const PRESET_LOCATIONS: { label: string; coords: Coordinates }[] = [
  { label: 'Altstadt-Nord', coords: { latitude: 50.9413, longitude: 6.9583 } },
  { label: 'Deutz', coords: { latitude: 50.9406, longitude: 6.9747 } },
  { label: 'Ehrenfeld', coords: { latitude: 50.9549, longitude: 6.9083 } },
  { label: 'Südstadt', coords: { latitude: 50.9174, longitude: 6.9608 } },
  { label: 'Leverkusen Boundary', coords: { latitude: 50.9845, longitude: 7.0008 } },
];

export const PEGEL_STATION_NAME = 'KÖLN';
