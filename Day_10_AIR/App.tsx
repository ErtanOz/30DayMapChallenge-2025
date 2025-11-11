

import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopBar from './components/TopBar';
import MapComponent from './components/MapComponent';
import SidePanel from './components/SidePanel';
import { AppData, Coordinates, PegelData } from './types';
import { StatusTone } from './components/StatusChip';
import { CONFIG, PRESET_LOCATIONS } from './constants';
import { fetchData, fetchPegel, AppDataRaw } from './services/apiService';

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(CONFIG.DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState<string>('Cologne, Germany');
  const [isLocationLabelManual, setIsLocationLabelManual] = useState<boolean>(false);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [pegelData, setPegelData] = useState<PegelData | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('Awaiting data…');
  const [statusTone, setStatusTone] = useState<StatusTone>(StatusTone.Pending);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [pulsePegel, setPulsePegel] = useState<boolean>(false);

  const autoRefreshTimerRef = useRef<number | null>(null);
  const refreshPegelTimerRef = useRef<number | null>(null);
  const refreshInFlightRef = useRef<Promise<void> | null>(null);

  const updateStatus = useCallback((text: string, tone: StatusTone) => {
    setStatusText(text);
    setStatusTone(tone);
  }, []);

  const pulseSection = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    const timer = setTimeout(() => setter(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const processFetchedAppData = useCallback((dataRaw: AppDataRaw) => {
    const newAppData: AppData = {
      lat: dataRaw.lat,
      lon: dataRaw.lon,
      aqi: dataRaw.aqi,
      currentAir: dataRaw.current,
      airHourly: dataRaw.air.hourly,
      currentWeather: dataRaw.cw,
      weatherHourly: dataRaw.weather.hourly,
      source: dataRaw.source,
    };
    setAppData(newAppData);
  }, []);

  const processFetchedPegelData = useCallback((data: PegelData) => {
    setPegelData(data);
    pulseSection(setPulsePegel);
  }, [pulseSection]);

  const updateDataForLocation = useCallback(
    async (coords: Coordinates, centerMap: boolean, skipStatusUpdate = false) => {
      if (refreshInFlightRef.current) return; // Prevent concurrent fetches

      setIsRefreshing(true);
      if (!skipStatusUpdate) {
        updateStatus('Refreshing…', StatusTone.Pending);
      }
      setCurrentLocation(coords);

      const fetchPromise = Promise.all([
        fetchData(coords.latitude, coords.longitude),
        fetchPegel(),
      ])
        .then(([airWeatherData, waterData]) => {
          processFetchedAppData(airWeatherData);
          processFetchedPegelData(waterData);
          updateStatus('Updated', StatusTone.Success);
        })
        .catch((err) => {
          console.error('Data update failed:', err);
          updateStatus('Update failed', StatusTone.Error);
          // Load demo data if all else fails or specific conditions met
          fetchData(coords.latitude, coords.longitude).then(processFetchedAppData);
          fetchPegel().then(processFetchedPegelData);
        })
        .finally(() => {
          setIsRefreshing(false);
          refreshInFlightRef.current = null;
        });

      refreshInFlightRef.current = fetchPromise;
      return fetchPromise;
    },
    [updateStatus, processFetchedAppData, processFetchedPegelData]
  );

  const requestGeolocation = useCallback(
    (centerMap = true) => {
      if (!navigator.geolocation) {
        updateStatus('Geolocation not supported', StatusTone.Error);
        updateDataForLocation(CONFIG.DEFAULT_LOCATION, centerMap);
        return;
      }
      updateStatus('Locating…', StatusTone.Pending);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationLabel('Your Location');
          setIsLocationLabelManual(true);
          updateDataForLocation({ latitude, longitude }, centerMap);
        },
        (err) => {
          console.warn('Geolocation error', err);
          updateStatus('Location access failed', StatusTone.Error);
          setLocationLabel('Cologne, Germany');
          setIsLocationLabelManual(false);
          updateDataForLocation(CONFIG.DEFAULT_LOCATION, centerMap);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    },
    [updateStatus, updateDataForLocation]
  );

  const startAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
    autoRefreshTimerRef.current = window.setInterval(() => {
      updateDataForLocation(currentLocation, false, true); // Skip status update for auto-refresh
    }, CONFIG.AUTO_REFRESH_MS);
  }, [currentLocation, updateDataForLocation]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }
  }, []);

  const handleToggleAutoRefresh = useCallback(
    (enabled: boolean) => {
      setAutoRefreshEnabled(enabled);
      if (enabled) {
        startAutoRefresh();
        updateStatus('Auto-refresh on', StatusTone.Success);
      } else {
        stopAutoRefresh();
        updateStatus('Auto-refresh off', StatusTone.Pending);
      }
    },
    [startAutoRefresh, stopAutoRefresh, updateStatus]
  );

  const handleSelectPreset = useCallback(
    (coords: Coordinates, label: string) => {
      setLocationLabel(label);
      setIsLocationLabelManual(true);
      updateDataForLocation(coords, true);
    },
    [updateDataForLocation]
  );

  const handleMapClick = useCallback(
    (coords: Coordinates) => {
      setLocationLabel('Selected Point');
      setIsLocationLabelManual(true);
      updateDataForLocation(coords, false);
    },
    [updateDataForLocation]
  );

  // Initial data load and auto-refresh setup on mount
  useEffect(() => {
    requestGeolocation(true); // Initial location and data fetch
    if (autoRefreshEnabled) {
      startAutoRefresh();
    }

    // Set up PegelOnline specific refresh
    refreshPegelTimerRef.current = window.setInterval(() => {
      fetchPegel().then(processFetchedPegelData);
    }, CONFIG.PEGEL_REFRESH_MINUTES * 60 * 1000);

    return () => {
      stopAutoRefresh();
      if (refreshPegelTimerRef.current) {
        clearInterval(refreshPegelTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div className="flex h-screen flex-col gap-4 p-4">
      <TopBar
        locationLabel={locationLabel}
        isLocationLabelManual={isLocationLabelManual}
        statusText={statusText}
        statusTone={statusTone}
        onRefresh={() => updateDataForLocation(currentLocation, false)}
        onLocateMe={() => requestGeolocation(true)}
        autoRefreshEnabled={autoRefreshEnabled}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        onSelectPreset={handleSelectPreset}
        isRefreshing={isRefreshing}
      />

      <main className="grid flex-1 grid-cols-1 gap-4 min-h-0 md:grid-cols-[1fr_380px]">
        <MapComponent
          currentLocation={currentLocation}
          onMapClick={handleMapClick}
          airData={appData}
          pegelData={pegelData}
        />
        <SidePanel
          airData={appData}
          pegelData={pegelData}
          pulsePegel={pulsePegel}
        />
      </main>

      <footer className="text-center text-xs text-text-tertiary">
        <span>Source: {appData?.source || 'pending'}</span> |{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:underline">
          Open-Meteo
        </a>{' '}
        |{' '}
        <a href="https://www.pegelonline.wsv.de/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:underline">
          PegelOnline
        </a>
      </footer>
    </div>
  );
};

export default App;