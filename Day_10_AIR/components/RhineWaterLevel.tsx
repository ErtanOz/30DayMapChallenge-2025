import React from 'react';
import PanelSection from './PanelSection';
import { PegelData } from '../types';

interface RhineWaterLevelProps {
  pegelData: PegelData | null;
  pulse: boolean;
}

const RhineWaterLevel: React.FC<RhineWaterLevelProps> = ({ pegelData, pulse }) => {
  const pegelTimeLabel = pegelData?.time
    ? `Pegel: ${new Date(pegelData.time).toLocaleTimeString()} (${pegelData.source})`
    : 'Waiting...';

  return (
    <PanelSection id="pegel-section" title="Rhine Water Level" subtitle={pegelTimeLabel} pulse={pulse}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Level</span>
          <span className="text-base font-medium text-text-primary">
            {pegelData?.value != null ? `${pegelData.value} ${pegelData.unit || ''}` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Station</span>
          <span className="text-base font-medium text-text-primary">
            {pegelData?.station || '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Discharge (Q)</span>
          <span className="text-base font-medium text-text-primary">
            {pegelData?.discharge != null ? `${pegelData.discharge} ${pegelData.dischargeUnit || ''}` : '--'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-border-secondary bg-bg-primary p-3">
          <span className="text-xs uppercase text-text-tertiary">Temp (WT)</span>
          <span className="text-base font-medium text-text-primary">
            {pegelData?.wtemp != null ? `${pegelData.wtemp.toFixed(1)} ${pegelData.wtempUnit || ''}` : '--'}
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-bg-primary p-3 text-xs text-text-tertiary">
        Source: WSV Pegelonline. Demo values appear if CORS blocks the call.
      </div>
    </PanelSection>
  );
};

export default RhineWaterLevel;
