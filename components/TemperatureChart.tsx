import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedChartDataPoint, TemperatureUnit } from '../src/types';
import SunIcon from './icons/SunIcon';
import CloudLowIcon from './icons/CloudLowIcon';


interface TemperatureChartProps {
  data: FormattedChartDataPoint[];
  unit: TemperatureUnit;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, unit }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4">No temperature data available.</div>;
  }

  const yAxisLabel = `Temperature (°${unit})`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <SunIcon className="w-6 h-6 mr-2 text-yellow-500" />
        Past 5 Days Temperature Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#4b5563" interval="preserveStartEnd" />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#4b5563' }} stroke="#4b5563" />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#cbd5e1' }}
            labelStyle={{ color: '#15803d', fontWeight: 'bold' }}
            formatter={(value: number, name: string) => [`${value}°${unit}`, name === 'maxTemp' ? 'High' : 'Low']}
          />
          <Legend iconType="circle" />
          <Line type="monotone" dataKey="maxTemp" name="High Temp" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="minTemp" name="Low Temp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
