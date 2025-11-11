

import React from 'react';
import AQISummary from './AQISummary';
import RhineWaterLevel from './RhineWaterLevel';
import CurrentWeather from './CurrentWeather';
import PM25Chart from './PM25Chart';
import AIAssistant from './AIAssistant';
import { AppData, PegelData } from '../types';

interface SidePanelProps {
  airData: AppData | null;
  pegelData: PegelData | null;
  pulsePegel: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ airData, pegelData, pulsePegel }) => {
  return (
    <aside className="custom-scrollbar flex flex-col gap-4 overflow-y-auto pr-2 md:pr-0">
      <AQISummary airData={airData} />
      <RhineWaterLevel pegelData={pegelData} pulse={pulsePegel} />
      <CurrentWeather airData={airData} />
      <PM25Chart times={airData?.airHourly?.time || []} pm25Values={airData?.airHourly?.pm2_5 || []} />
      <AIAssistant airData={airData} pegelData={pegelData} />
    </aside>
  );
};

export default SidePanel;