import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

interface CandlestickChartProps {
  data: any[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  colors: {
    backgroundColor = 'transparent',
    lineColor = '#EF4444',
    textColor = 'var(--aegis-text-muted)',
  } = {},
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textColor,
        fontFamily: 'JetBrains Mono, monospace',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: 'rgba(184, 75, 38, 0.1)' },
        horzLines: { color: 'rgba(184, 75, 38, 0.1)' },
      },
      timeScale: {
        borderColor: 'rgba(184, 75, 38, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(184, 75, 38, 0.2)',
      },
    }) as any;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div ref={chartContainerRef} className="w-full h-full min-h-[400px] relative overflow-hidden">
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm z-10">
          <div className="w-8 h-8 border-4 border-brand-amber border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
