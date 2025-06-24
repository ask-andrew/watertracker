
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedChartDataPoint } from '../types';
import RainIcon from './icons/RainIcon';

interface PrecipitationChartProps {
  data: FormattedChartDataPoint[]; // Expects precipitation data to be in inches
}

const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4">No precipitation data available.</div>;
  }
  const yAxisLabel = `Precipitation (in)`; // Changed unit to inches

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <RainIcon className="w-6 h-6 mr-2 text-blue-500" />
        Past 5 Days Precipitation
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#4b5563" />
          <YAxis 
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#4b5563' }} 
            stroke="#4b5563"
            tickFormatter={(value) => value.toFixed(1)} // Format tick to one decimal place
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#cbd5e1' }}
            labelStyle={{ color: '#15803d', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toFixed(1)} in`, 'Precipitation']} // Changed unit to inches and format
          />
          <Legend iconType="square"/>
          <Bar dataKey="precipitation" name="Precipitation" fill="#60a5fa" barSize={30} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrecipitationChart;