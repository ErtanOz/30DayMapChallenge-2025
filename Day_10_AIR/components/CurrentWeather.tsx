import React from 'react';
import PanelSection from './PanelSection';
import { AppData } from '../types';

interface CurrentWeatherProps {
  airData: AppData | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ airData }) => {
  const weatherTimeLabel = airData?.currentWeather?.time
    ? `Weather: ${new Date(airData.currentWeather.time).toLocaleTimeString()}`
    : 'Waiting...';

  return (
    <PanelSection id="weather-section" title="Current Weather" subtitle={weatherTimeLabel}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Temperature</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentWeather?.temperature != null ? `${airData.currentWeather.temperature.toFixed(1)} °C` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Humidity</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.weatherHourly?.relative_humidity_2m?.at(-1) != null
              ? `${airData.weatherHourly.relative_humidity_2m.at(-1)} %`
              : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Wind</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentWeather?.windspeed != null ? `${airData.currentWeather.windspeed.toFixed(1)} m/s` : '--'}
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-bg-primary p-3 text-xs text-text-tertiary">
        Source: Open-Meteo Weather API.
      </div>
    </PanelSection>
  );
};

export default CurrentWeather;
