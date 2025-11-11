export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AirQualityData {
  time: string;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  co: number | null;
}

export interface AirQualityHourlyData {
  time: string[];
  pm2_5: (number | null)[];
  pm10: (number | null)[];
  carbon_monoxide: (number | null)[];
  nitrogen_dioxide: (number | null)[];
  ozone: (number | null)[];
}

export interface AirQualityApiResponse {
  hourly: AirQualityHourlyData;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  time: string;
}

export interface WeatherHourlyData {
  temperature_2m: (number | null)[];
  relative_humidity_2m: (number | null)[];
  windspeed_10m: (number | null)[];
}

export interface WeatherApiResponse {
  current_weather: CurrentWeather;
  hourly: WeatherHourlyData;
}

export interface PegelData {
  value: number | null;
  unit: string | null;
  time: string | null;
  discharge: number | null;
  dischargeUnit: string | null;
  wtemp: number | null;
  wtempUnit: string | null;
  lat: number | null;
  lon: number | null;
  station: string | null;
  source: 'live' | 'demo';
}

export interface AppData {
  lat: number;
  lon: number;
  aqi: number | null;
  currentAir: AirQualityData;
  airHourly: AirQualityHourlyData;
  currentWeather: CurrentWeather;
  weatherHourly: WeatherHourlyData;
  source: 'live' | 'demo';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AQILevel {
  Good = 'Good',
  Moderate = 'Moderate',
  Unhealthy = 'Unhealthy',
  Hazardous = 'Hazardous',
  NoData = 'No data',
}

export function getAQIFromPM25(pm25: number | null): number | null {
  if (pm25 == null || isNaN(pm25)) return null;
  const c = pm25;
  if (c <= 12.0) return scaleAQI(c, 0.0, 12.0, 0, 50);
  if (c <= 35.4) return scaleAQI(c, 12.1, 35.4, 51, 100);
  if (c <= 55.4) return scaleAQI(c, 35.5, 55.4, 101, 150);
  if (c <= 150.4) return scaleAQI(c, 55.5, 150.4, 151, 200);
  if (c <= 250.4) return scaleAQI(c, 150.5, 250.4, 201, 300);
  if (c <= 500.4) return scaleAQI(c, 250.5, 500.4, 301, 500);
  return 500;
}

function scaleAQI(Cp: number, BP_low: number, BP_high: number, I_low: number, I_high: number): number {
  return Math.round(((I_high - I_low) / (BP_high - BP_low)) * (Cp - BP_low) + I_low);
}

export function getAQIColor(aqi: number | null): string {
  if (aqi == null) return 'bg-gray-700';
  if (aqi <= 50) return 'bg-accent-green';
  if (aqi <= 100) return 'bg-accent-yellow';
  if (aqi <= 150) return 'bg-accent-red';
  return 'bg-accent-purple';
}

export function getAQILevelText(aqi: number | null): AQILevel {
  if (aqi == null) return AQILevel.NoData;
  if (aqi <= 50) return AQILevel.Good;
  if (aqi <= 100) return AQILevel.Moderate;
  if (aqi <= 150) return AQILevel.Unhealthy;
  return AQILevel.Hazardous;
}

export function getAQIRadius(aqi: number | null): number {
  if (aqi == null) return 400;
  if (aqi <= 50) return 400;
  if (aqi <= 100) return 700;
  if (aqi <= 150) return 1000;
  return 1400;
}
