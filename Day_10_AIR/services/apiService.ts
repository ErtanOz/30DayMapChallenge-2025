import {
  AirQualityApiResponse,
  AirQualityData,
  AirQualityHourlyData,
  Coordinates,
  CurrentWeather,
  PegelData,
  WeatherApiResponse,
  WeatherHourlyData,
  getAQIFromPM25,
} from '../types';
import { CONFIG } from '../constants';

export interface AppDataRaw {
  lat: number;
  lon: number;
  aqi: number | null;
  current: AirQualityData;
  air: AirQualityApiResponse;
  weather: WeatherApiResponse;
  cw: CurrentWeather;
  source: 'live' | 'demo';
}

/**
 * Fetches air quality and weather data for a given location.
 * Falls back to demo data if API requests fail or time out.
 * @param lat Latitude
 * @param lon Longitude
 * @returns Combined air quality and weather data.
 */
export async function fetchData(lat: number, lon: number): Promise<AppDataRaw> {
  const airUrl = `${CONFIG.API_ENDPOINTS.air}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`;
  const weatherUrl = `${CONFIG.API_ENDPOINTS.weather}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`;

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    const [airRes, weatherRes] = await Promise.race([
      Promise.all([fetch(airUrl), fetch(weatherUrl)]),
      timeoutPromise,
    ]);

    if (!airRes.ok || !weatherRes.ok) {
      throw new Error(`API request failed: Air ${airRes.status}, Weather ${weatherRes.status}`);
    }

    // Fix: Explicitly type the results of json() to resolve type inference issues.
    // This ensures 'air' is AirQualityApiResponse and 'weather' is WeatherApiResponse.
    const air: AirQualityApiResponse = await airRes.json();
    const weather: WeatherApiResponse = await weatherRes.json();

    if (!air?.hourly?.time?.length) {
      throw new Error('Invalid air quality data received.');
    }

    const lastIndex = air.hourly.time.length - 1;
    const currentAir: AirQualityData = {
      time: air.hourly.time[lastIndex],
      pm25: air.hourly.pm2_5?.[lastIndex] ?? null,
      pm10: air.hourly.pm10?.[lastIndex] ?? null,
      no2: air.hourly.nitrogen_dioxide?.[lastIndex] ?? null,
      o3: air.hourly.ozone?.[lastIndex] ?? null,
      co: air.hourly.carbon_monoxide?.[lastIndex] ?? null,
    };

    const aqi = getAQIFromPM25(currentAir.pm25);
    const currentWeather = weather.current_weather || ({} as CurrentWeather);

    return {
      lat,
      lon,
      aqi,
      current: currentAir,
      air,
      weather,
      cw: currentWeather,
      source: 'live',
    };
  } catch (error) {
    console.error('API request failed, falling back to demo data.', error);
    return buildDemoData(lat, lon);
  }
}

/**
 * Generates mock air quality and weather data for demo purposes.
 * @param lat Latitude
 * @param lon Longitude
 * @returns Demo data.
 */
function buildDemoData(lat: number, lon: number): AppDataRaw {
  const now = new Date();
  const times: string[] = [];
  const pm25Arr: (number | null)[] = [];
  const pm10Arr: (number | null)[] = [];
  const no2Arr: (number | null)[] = [];
  const o3Arr: (number | null)[] = [];
  const coArr: (number | null)[] = [];
  const tempArr: (number | null)[] = [];
  const humidityArr: (number | null)[] = [];
  const windArr: (number | null)[] = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000); // Hourly data for last 24 hours
    times.push(time.toISOString());
    pm25Arr.push(Math.max(3, 8 + Math.sin(i / 3) * 4 + Math.random() * 2));
    pm10Arr.push(Math.max(5, 15 + Math.cos(i / 4) * 5 + Math.random() * 3));
    no2Arr.push(Math.max(10, 20 + Math.sin(i / 5) * 8 + Math.random() * 5));
    o3Arr.push(Math.max(20, 40 + Math.cos(i / 6) * 10 + Math.random() * 7));
    coArr.push(Math.max(100, 200 + Math.sin(i / 7) * 50 + Math.random() * 30));
    tempArr.push(Math.max(5, 15 + Math.sin(i / 8) * 10 + Math.random() * 4));
    humidityArr.push(Math.max(40, 60 + Math.cos(i / 9) * 20 + Math.random() * 10));
    windArr.push(Math.max(0.5, 2 + Math.sin(i / 10) * 1.5 + Math.random() * 1));
  }

  const lastIndex = times.length - 1;

  const currentAir: AirQualityData = {
    time: times[lastIndex],
    pm25: pm25Arr[lastIndex],
    pm10: pm10Arr[lastIndex],
    no2: no2Arr[lastIndex],
    o3: o3Arr[lastIndex],
    co: coArr[lastIndex],
  };

  const aqi = getAQIFromPM25(currentAir.pm25);

  const air: AirQualityApiResponse = {
    hourly: {
      time: times,
      pm2_5: pm25Arr,
      pm10: pm10Arr,
      carbon_monoxide: coArr,
      nitrogen_dioxide: no2Arr,
      ozone: o3Arr,
    },
  };

  const currentWeather: CurrentWeather = {
    temperature: tempArr[lastIndex] ?? 0,
    windspeed: windArr[lastIndex] ?? 0,
    time: times[lastIndex],
  };

  const weather: WeatherApiResponse = {
    current_weather: currentWeather,
    hourly: {
      temperature_2m: tempArr,
      relative_humidity_2m: humidityArr,
      windspeed_10m: windArr,
    },
  };

  return {
    lat,
    lon,
    aqi,
    current: currentAir,
    air,
    weather,
    cw: currentWeather,
    source: 'demo',
  };
}

/**
 * Fetches Rhine water level data from PegelOnline.
 * Falls back to demo data if the API request fails.
 * @returns PegelData
 */
export async function fetchPegel(): Promise<PegelData> {
  const url = `${CONFIG.API_ENDPOINTS.pegelonline}/${CONFIG.PEGEL_STATION_ID}.json?includeTimeseries=true&includeCurrentMeasurement=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Pegelonline HTTP ${res.status}`);
    }
    return parsePegelResponse(await res.json());
  } catch (e) {
    console.warn('Pegelonline request failed, using demo data.', e);
    return buildDemoPegel();
  }
}

/**
 * Parses the PegelOnline API response into a structured PegelData object.
 * @param json The JSON response from PegelOnline.
 * @returns Parsed PegelData.
 */
function parsePegelResponse(json: any): PegelData {
  const findSeries = (shortname: string) =>
    json.timeseries?.find((s: any) => s.shortname === shortname);
  const getMeasurement = (series: any) => series?.currentMeasurement;

  const W = getMeasurement(findSeries('W')); // Water level
  const Q = getMeasurement(findSeries('Q')); // Discharge
  const WT = getMeasurement(findSeries('WT')); // Water Temperature

  return {
    value: W?.value ?? null,
    unit: findSeries('W')?.unit ?? null,
    time: W?.timestamp ?? null,
    discharge: Q?.value ?? null,
    dischargeUnit: findSeries('Q')?.unit ?? null,
    wtemp: WT?.value ?? null,
    wtempUnit: findSeries('WT')?.unit ?? null,
    lat: json.latitude ?? null,
    lon: json.longitude ?? null,
    station: json.shortname ?? null,
    source: 'live',
  };
}

/**
 * Generates mock Rhine water level data for demo purposes.
 * @returns Demo PegelData.
 */
function buildDemoPegel(): PegelData {
  return {
    value: 304,
    unit: 'cm',
    time: new Date().toISOString(),
    discharge: 1910,
    dischargeUnit: 'm³/s',
    wtemp: 9.1,
    wtempUnit: '°C',
    lat: CONFIG.DEFAULT_LOCATION.latitude + 0.0005, // Slightly offset from default location for marker visibility
    lon: CONFIG.DEFAULT_LOCATION.longitude + 0.0005,
    station: 'KÖLN (Demo)',
    source: 'demo',
  };
}