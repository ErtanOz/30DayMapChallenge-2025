

import React from 'react';
import PanelSection from './PanelSection';
import { AppData, getAQIColor, getAQILevelText, AQILevel } from '../types';

interface AQISummaryProps {
  airData: AppData | null;
}

const AQISummary: React.FC<AQISummaryProps> = ({ airData }) => {
  const aqiValue = airData?.aqi ?? null;
  const aqiLevel = getAQILevelText(aqiValue);
  const aqiColorClass = getAQIColor(aqiValue);
  const lastUpdated = airData?.currentAir?.time
    ? new Date(airData.currentAir.time).toLocaleTimeString()
    : 'Updating...';

  return (
    <PanelSection id="aqi-section" title="Air Quality Summary" subtitle={`Air: ${lastUpdated}`}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <div className="text-4xl font-bold leading-none text-text-primary">
            {aqiValue != null ? aqiValue : '--'}
          </div>
          <div className="mt-1 text-sm text-text-secondary">AQI ({aqiLevel})</div>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-bg-primary ${aqiColorClass}`}>
          <span>{aqiLevel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">PM2.5</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentAir?.pm25 != null ? `${airData.currentAir.pm25.toFixed(1)} µg/m³` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">PM10</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentAir?.pm10 != null ? `${airData.currentAir.pm10.toFixed(1)} µg/m³` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">NO₂</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentAir?.no2 != null ? `${airData.currentAir.no2.toFixed(1)} µg/m³` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">O₃</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentAir?.o3 != null ? `${airData.currentAir.o3.toFixed(1)} µg/m³` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">CO</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.currentAir?.co != null ? `${airData.currentAir.co.toFixed(1)} µg/m³` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Location</span>
          <span className="text-base font-medium text-text-primary">
            {airData?.lat != null && airData?.lon != null ? `${airData.lat.toFixed(4)}, ${airData.lon.toFixed(4)}` : '--'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 rounded-full bg-bg-tertiary px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green"></span>
          {AQILevel.Good}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-bg-tertiary px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-yellow"></span>
          {AQILevel.Moderate}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-bg-tertiary px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-red"></span>
          {AQILevel.Unhealthy}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-bg-tertiary px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-purple"></span>
          {AQILevel.Hazardous}
        </div>
      </div>

      <div className="rounded-lg bg-bg-primary p-3 text-xs text-text-tertiary">
        The map displays a simulated air quality heatmap based on the selected point's AQI. Demo data is used if the API call fails.
      </div>
    </PanelSection>
  );
};

export default AQISummary;