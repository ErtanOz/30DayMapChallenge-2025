
import React, { useRef, useEffect, useCallback } from 'react';
import L from 'leaflet'; // Add this import
import 'leaflet.heat'; // Import the heatmap plugin
import { PEGEL_STATION_NAME } from '../constants'; // Import PEGEL_STATION_NAME
import { AppData, Coordinates } from '../types'; // Import AppData and Coordinates

// Augment the Leaflet module directly to include types for Leaflet.heat
declare module 'leaflet' {
  interface Map {
    _heat: any; // Internal property for heat layer
  }

  // Extend L.Layer for HeatLayer interface
  interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: L.LatLngExpression[]): this;
    addLatLng(latlng: L.LatLngExpression): this;
    setOptions(options: any): this;
  }

  // Add heatLayer function to the L object's static methods
  function heatLayer(latlngs: L.LatLngExpression[], options?: HeatLayerOptions): HeatLayer;

  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }
}

interface MapComponentProps {
  currentLocation: Coordinates;
  onMapClick: (coords: Coordinates) => void;
  airData: AppData | null;
  pegelData: { lat: number | null; lon: number | null; value: number | null; unit: string | null } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentLocation,
  onMapClick,
  airData,
  pegelData,
}) => {
  // Fix: Initialize useRef with null, not mapRef.current
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null); // Use useRef for heatLayer
  const pegelMarkerRef = useRef<L.Marker | null>(null);

  // Function to generate simulated heatmap points
  const generateHeatmapPoints = useCallback(
    (centerLat: number, centerLon: number, aqi: number | null) => {
      const points: L.LatLngLiteral[] = [];
      if (aqi == null) return points;

      // Define a bounding box for central Cologne for demo heatmap spread
      const latMin = centerLat - 0.05; // ~5.5km south
      const latMax = centerLat + 0.05; // ~5.5km north
      const lonMin = centerLon - 0.1; // ~7.5km west
      const lonMax = centerLon + 0.1; // ~7.5km east

      const gridSize = 10; // Number of points along each dimension
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const lat = latMin + (latMax - latMin) * (i / gridSize) + (Math.random() - 0.5) * 0.005;
          const lon = lonMin + (lonMax - lonMin) * (j / gridSize) + (Math.random() - 0.5) * 0.005;

          // Scale intensity based on AQI. Lower AQI = lower intensity.
          // AQI 0-50 (Good) -> intensity ~0.2-0.4
          // AQI 51-100 (Moderate) -> intensity ~0.4-0.6
          // AQI 101-150 (Unhealthy) -> intensity ~0.6-0.8
          // AQI >150 (Hazardous) -> intensity ~0.8-1.0
          let intensity = 0;
          if (aqi <= 50) intensity = 0.2 + (aqi / 50) * 0.2;
          else if (aqi <= 100) intensity = 0.4 + ((aqi - 50) / 50) * 0.2;
          else if (aqi <= 150) intensity = 0.6 + ((aqi - 100) / 50) * 0.2;
          else intensity = 0.8 + ((aqi - 150) / 350) * 0.2; // Scale max AQI 500 to 1.0

          // Add some random local variation
          intensity = Math.max(0.1, Math.min(1.0, intensity + (Math.random() - 0.5) * 0.1));

          points.push({ lat, lng: lon, alt: intensity }); // 'alt' is used for intensity by Leaflet.heat
        }
      }
      return points;
    },
    []
  );

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: false,
        attributionControl: false,
      }).setView([currentLocation.latitude, currentLocation.longitude], 12);

      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      });

      const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      });

      streetLayer.addTo(mapRef.current); // Street mode default

      L.control
        .layers(
          {
            Street: streetLayer,
            Dark: darkLayer,
          },
          {},
          { position: 'topleft', collapsed: true }
        )
        .addTo(mapRef.current);

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      });

      // Add zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }
  }, [currentLocation, onMapClick]);

  // Update map view when currentLocation changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([currentLocation.latitude, currentLocation.longitude], mapRef.current.getZoom(), {
        animate: true,
      });
    }
  }, [currentLocation]);

  // Update AQI heatmap
  useEffect(() => {
    if (mapRef.current && airData) {
      const { lat, lon, aqi } = airData;
      const heatmapPoints = generateHeatmapPoints(lat, lon, aqi);

      if (heatLayerRef.current) {
        heatLayerRef.current.setLatLngs(heatmapPoints);
      } else {
        heatLayerRef.current = L.heatLayer(heatmapPoints, {
          radius: 25,
          blur: 15,
          maxZoom: 17, // Heatmap will be less effective at very high zoom levels
          minOpacity: 0.2,
          gradient: {
            0.0: '#22c55e', // Green for Good
            0.4: '#eab308', // Yellow for Moderate
            0.6: '#ef4444', // Red for Unhealthy
            0.8: '#8b5cf6', // Purple for Hazardous
            1.0: '#8b5cf6', // Continue purple for very hazardous
          },
        }).addTo(mapRef.current);
      }
    } else if (heatLayerRef.current) {
      // Clear heatmap if no airData
      heatLayerRef.current.setLatLngs([]);
    }
  }, [airData, generateHeatmapPoints]);

  // Update PegelOnline marker
  useEffect(() => {
    if (mapRef.current && pegelData?.lat && pegelData?.lon) {
      const { lat, lon, value, unit } = pegelData;
      const popupContent = `<b>Rhine Water Level (${PEGEL_STATION_NAME})</b><br>Level: ${value != null ? `${value} ${unit || ''}` : '--'}`;

      if (pegelMarkerRef.current) {
        pegelMarkerRef.current.setLatLng([lat, lon]);
        pegelMarkerRef.current.setPopupContent(popupContent);
      } else {
        pegelMarkerRef.current = L.marker([lat, lon], {
          title: `Rheinpegel ${PEGEL_STATION_NAME}`,
        })
          .addTo(mapRef.current)
          .bindPopup(popupContent);
      }
    } else if (pegelMarkerRef.current) {
      mapRef.current?.removeLayer(pegelMarkerRef.current);
      pegelMarkerRef.current = null;
    }
  }, [pegelData]);

  return <div id="map" className="h-full w-full rounded-xl border border-border-secondary shadow-lg-custom"></div>;
};

export default MapComponent;