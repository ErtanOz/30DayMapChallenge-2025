
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import PanelSection from './PanelSection';

interface PM25ChartProps {
  times: string[];
  pm25Values: (number | null)[];
}

const PM25Chart: React.FC<PM25ChartProps> = ({ times, pm25Values }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Correctly slice both arrays to ensure indices align
    const slicedTimes = times.slice(-24);
    const slicedPm25Values = pm25Values.slice(-24);

    const data = slicedTimes.map((time, i) => ({
      x: new Date(time),
      y: slicedPm25Values[i] ?? null,
    }));

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = data;
      chartInstanceRef.current.update();
    } else {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'PM2.5',
              data: data,
              borderColor: 'rgb(59, 130, 246)', // Tailwind accent-blue
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: { unit: 'hour', displayFormats: { hour: 'HH:mm' } },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgb(156, 163, 175)', maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }, // Tailwind text-tertiary
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgb(156, 163, 175)' }, // Tailwind text-tertiary
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [times, pm25Values]);

  return (
    <PanelSection id="pm25-chart-section" title="Last 24h PM2.5 Trend" subtitle="µg/m³">
      <div className="h-32 w-full">
        <canvas id="pm25Chart" ref={chartRef}></canvas>
      </div>
    </PanelSection>
  );
};

export default PM25Chart;
