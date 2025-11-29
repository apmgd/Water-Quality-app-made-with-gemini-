import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WaterDataPoint } from '../types';

interface WaterChartProps {
  data: WaterDataPoint[];
}

export const WaterChart: React.FC<WaterChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const threshold = data[0].threshold;
  
  // Calculate min/max to determine gradient offsets
  const dataMax = Math.max(...data.map((i) => i.value));
  const dataMin = Math.min(...data.map((i) => i.value));
  
  // If the max is lower than threshold, everything is green.
  // If min is higher than threshold, everything is red.
  
  const offset = (threshold - dataMin) / (dataMax - dataMin);
  
  // Clamp offset between 0 and 1
  const gradientOffset = Math.min(Math.max(offset, 0), 1);

  // Custom Tick Formatter
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="h-64 w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              {/* Top of chart (High values) */}
              <stop offset={0} stopColor="#ef4444" stopOpacity={1} />
              <stop offset={1 - gradientOffset} stopColor="#ef4444" stopOpacity={1} />
              
              {/* Transition point */}
              <stop offset={1 - gradientOffset} stopColor="#22c55e" stopOpacity={1} />
              <stop offset={1} stopColor="#22c55e" stopOpacity={1} />
            </linearGradient>
            
            <linearGradient id="splitColorFill" x1="0" y1="0" x2="0" y2="1">
               <stop offset={0} stopColor="#ef4444" stopOpacity={0.2} />
               <stop offset={1 - gradientOffset} stopColor="#ef4444" stopOpacity={0.2} />
               <stop offset={1 - gradientOffset} stopColor="#22c55e" stopOpacity={0.2} />
               <stop offset={1} stopColor="#22c55e" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            tick={{fontSize: 10}} 
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <YAxis 
            tick={{fontSize: 10}} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'black', color: 'white', borderRadius: '4px', border: 'none' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          
          <ReferenceLine y={threshold} stroke="black" strokeDasharray="3 3" label={{ position: 'top', value: 'Danger Limit', fill: 'black', fontSize: 10 }} />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#splitColor)"
            fill="url(#splitColorFill)"
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
