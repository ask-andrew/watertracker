import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FormattedChartDataPoint, TemperatureUnit } from '../src/types';
import ThermometerIcon from './icons/ThermometerIcon';
import RainIcon from './icons/RainIcon';
import WateringCanIcon from './icons/WateringCanIcon';

interface CombinedWeatherChartProps {
  data: FormattedChartDataPoint[];
  unit: TemperatureUnit;
}

const CustomWateringMarker = (props: any) => {
  const { cx, cy, payload, fill } = props;

  if (!payload || payload.wateringMarkerYValue === undefined || typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) {
    return null;
  }

  const iconSize = 16; // Desired icon size in pixels (e.g., 16x16 for w-4 h-4)

  return (
    <svg 
      x={cx - iconSize / 2} 
      y={cy - iconSize / 2} 
      width={iconSize} 
      height={iconSize} 
      fill={fill} 
    >
      <WateringCanIcon
        className="w-full h-full" 
        fillColor="currentColor"   
      />
    </svg>
  );
};


const CombinedWeatherChart: React.FC<CombinedWeatherChartProps> = ({ data, unit }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-green-100/50 text-gray-600">No weather data available for chart.</div>;
  }

  const yAxisTempLabel = `Temperature (°${unit})`;
  const yAxisPrecipLabel = `Precipitation (in)`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100/50">
      <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center font-playfair">
        <ThermometerIcon className="w-6 h-6 mr-2 text-red-600" />
        <RainIcon className="w-6 h-6 mr-2 text-blue-600" />
        Daily Weather Overview
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e6e6e6" />
          <XAxis dataKey="name" stroke="#555" interval="preserveStartEnd" tick={{ fill: '#555' }} />
          <YAxis
            yAxisId="left"
            label={{ value: yAxisTempLabel, angle: -90, position: 'insideLeft', fill: '#555', dx: -5 }}
            stroke="#555"
            domain={['auto', 'auto']}
            tick={{ fill: '#555' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: yAxisPrecipLabel, angle: -90, position: 'insideRight', fill: '#555', dx: 10 }}
            stroke="#555"
            domain={[0, (dataMax: number) => Math.max(dataMax > 0 ? dataMax : 0, 0.5)]}
            tickFormatter={(value) => value.toFixed(1)}
            allowDataOverflow={true}
            tick={{ fill: '#555' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', borderColor: '#d1d5db', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1em' }}
            itemStyle={{ color: '#333' }}
            formatter={(value: number, name: string, entry: any) => {
              if (name === 'High Temp' || name === 'Low Temp') {
                return [`${value}°${unit}`, name];
              }
              if (name === 'Precipitation') {
                return [`${value.toFixed(1)} in`, name];
              }
              if (name === 'Manual Watering') {
                if (entry.payload && entry.payload.manualWatering) {
                    const amount = entry.payload.wateringAmount;
                    const unit = entry.payload.wateringUnit;
                    if (amount !== undefined && unit !== undefined) {
                        return [`${amount} ${unit}`, name];
                    } else {
                        return ['Logged', name];
                    }
                }
                return null;
              }
              return [value, name];
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px' }} />
          <Line yAxisId="left" type="monotone" dataKey="maxTemp" name="High Temp" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line yAxisId="left" type="monotone" dataKey="minTemp" name="Low Temp" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Bar yAxisId="right" dataKey="precipitation" name="Precipitation" fill="#34d399" barSize={30} radius={[6, 6, 0, 0]} fillOpacity={0.85} />
          
          <Scatter 
            yAxisId="right" 
            name="Manual Watering" 
            dataKey="wateringMarkerYValue" 
            fill="#10b981" 
            shape={<CustomWateringMarker />} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedWeatherChart;