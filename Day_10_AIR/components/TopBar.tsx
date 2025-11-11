import React from 'react';
import Button from './Button';
import Select from './Select';
import StatusChip, { StatusTone } from './StatusChip';
import Switch from './Switch';
import { PRESET_LOCATIONS } from '../constants';
import { Coordinates } from '../types';

interface TopBarProps {
  locationLabel: string;
  isLocationLabelManual: boolean;
  statusText: string;
  statusTone: StatusTone;
  onRefresh: (centerMap: boolean) => Promise<void>;
  onLocateMe: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: (enabled: boolean) => void;
  onSelectPreset: (coords: Coordinates, label: string) => void;
  isRefreshing: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  locationLabel,
  isLocationLabelManual,
  statusText,
  statusTone,
  onRefresh,
  onLocateMe,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onSelectPreset,
  isRefreshing,
}) => {
  const presetOptions = PRESET_LOCATIONS.map((preset) => ({
    value: `${preset.coords.latitude},${preset.coords.longitude}`,
    label: preset.label,
  }));

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) return;
    const [latStr, lonStr] = e.target.value.split(',');
    const lat = Number(latStr);
    const lon = Number(lonStr);
    const selectedLabel = e.target.options[e.target.selectedIndex].text;

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      onSelectPreset({ latitude: lat, longitude: lon }, selectedLabel);
      // Reset select after a short delay
      setTimeout(() => {
        e.target.value = '';
      }, 400);
    }
  };

  return (
    <header className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-secondary p-4 shadow-lg-custom md:gap-4">
      <div className="flex flex-col flex-wrap items-center justify-between gap-2 md:flex-row md:gap-4">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-text-primary md:text-2xl">
            Cologne Air & Water Monitor
          </h1>
          <span
            className={`text-sm text-text-tertiary ${isLocationLabelManual ? '' : 'italic'}`}
            id="location-label"
          >
            {locationLabel}
          </span>
        </div>
        <StatusChip text={statusText} tone={statusTone} className="min-w-[120px] justify-center" />
      </div>

      <div className="flex flex-col flex-wrap items-center justify-between gap-3 md:flex-row md:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => onRefresh(false)} loading={isRefreshing}>
            <span className={`${isRefreshing ? 'hidden' : 'inline'}`}>⟳ Refresh</span>
          </Button>
          <Button onClick={onLocateMe} disabled={isRefreshing}>
            <span className="text-xl">📡</span> Locate Me
          </Button>
          <Switch
            label="Auto-refresh"
            checked={autoRefreshEnabled}
            onChange={(e) => onToggleAutoRefresh(e.target.checked)}
            disabled={isRefreshing}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={presetOptions}
            placeholder="Jump to preset…"
            onChange={handlePresetChange}
            disabled={isRefreshing}
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
