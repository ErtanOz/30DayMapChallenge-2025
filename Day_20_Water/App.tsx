import React, { useState, useEffect, useRef } from 'react';
import FloodMap from './components/FloodMap';
import Dashboard from './components/Dashboard';
import { SimulationStatus, Landmark, FloodReport } from './types';
import { getFloodSituationReport } from './services/geminiService';

// Notable landmarks in Cologne with approximate "risk" elevations (mock data for sim)
const LANDMARKS: Landmark[] = [
  { name: 'Cologne Cathedral', lat: 50.9413, lng: 6.9583, elevation: 19.0 }, // Very high, safe
  { name: 'Old Town (Altstadt)', lat: 50.9383, lng: 6.9613, elevation: 8.5 }, // At risk
  { name: 'Deutzer Werft', lat: 50.9360, lng: 6.9690, elevation: 6.5 }, // Early flood
  { name: 'Rhine Park', lat: 50.9480, lng: 6.9720, elevation: 7.0 }, // Park area
  { name: 'Chocolate Museum', lat: 50.9322, lng: 6.9643, elevation: 9.0 }, // Island-ish
  { name: 'Poller Wiesen', lat: 50.9200, lng: 6.9750, elevation: 5.5 } // Floodplain
];

const App: React.FC = () => {
  const [waterLevel, setWaterLevel] = useState<number>(3.5); // Starting at normal level
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const reportGenerationTimeout = useRef<number | null>(null);

  const generateNewReport = async (level: number) => {
    setIsLoadingReport(true);
    const text = await getFloodSituationReport(level);
    const newReport: FloodReport = {
        level,
        text,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
    setReports(prev => [newReport, ...prev].slice(0, 10)); // Keep max 10 reports
    setIsLoadingReport(false);
  };

  // Debounced report generation
  useEffect(() => {
    if (reportGenerationTimeout.current) {
        clearTimeout(reportGenerationTimeout.current);
    }
    
    // In auto-rise, only generate reports on whole numbers to reduce API calls
    if (status === SimulationStatus.PLAYING && Math.round(waterLevel * 10) % 10 !== 0) {
       return;
    }

    reportGenerationTimeout.current = window.setTimeout(() => {
        generateNewReport(waterLevel);
    }, 800);

    return () => {
        if (reportGenerationTimeout.current) {
            clearTimeout(reportGenerationTimeout.current);
        }
    };
  }, [waterLevel, status]);

  // Initial report on mount
  useEffect(() => {
    generateNewReport(waterLevel);
  }, []);

  // Animation Loop (throttled to reduce heavy map recalculations)
  useEffect(() => {
    if (status !== SimulationStatus.PLAYING) return;

    const tickMs = 120; // lower frequency keeps CPU down while maintaining smoothness
    const riseRatePerSecond = 0.8;
    const increment = riseRatePerSecond * (tickMs / 1000);

    const intervalId = window.setInterval(() => {
      setWaterLevel(prev => {
        const nextLevel = prev + increment;
        if (nextLevel >= 13.0) {
          clearInterval(intervalId);
          setStatus(SimulationStatus.IDLE);
          return 13.0;
        }
        return nextLevel;
      });
    }, tickMs);

    return () => clearInterval(intervalId);
  }, [status]);

  return (
    <main className="relative w-full h-full flex flex-col bg-slate-900">
      <FloodMap 
        waterLevel={waterLevel} 
        landmarks={LANDMARKS} 
      />
      <Dashboard 
        waterLevel={waterLevel} 
        status={status} 
        reports={reports}
        isLoadingReport={isLoadingReport}
        onLevelChange={setWaterLevel}
        onStatusChange={setStatus}
      />
    </main>
  );
};

export default App;
