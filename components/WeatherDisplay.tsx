import React from 'react';
import { DailyWeather, FormattedChartDataPoint, TemperatureUnit, WateringEvent } from '../src/types';
import WateringRecommendation from './WateringRecommendation';
import CombinedWeatherChart from './CombinedWeatherChart';
import ThermometerIcon from './icons/ThermometerIcon';
import SunlightDurationIcon from './icons/SunlightDurationIcon';
import { MM_TO_INCHES } from '../src/constants';

interface WeatherDisplayProps {
  weatherData: DailyWeather[] | null;
  wateringLogs: WateringEvent[];
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
  isLoading: boolean;
  error: string | null;
}

const celsiusToFahrenheit = (celsius: number): number => parseFloat((celsius * 9/5 + 32).toFixed(1));

const getLocalDateString = (timestamp: number): string => {
  const date = new Date(timestamp);
  // Adjust to ensure we get the local date string, not UTC day if time is early AM
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, wateringLogs, temperatureUnit, onToggleUnit, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-green-100/50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto" role="status" aria-label="Loading weather data"></div>
        <p className="mt-4 text-xl font-medium text-green-700">Fetching weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-8 rounded-2xl shadow-xl my-6" role="alert">
        <p className="font-bold text-xl mb-2">Error Loading Weather</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-green-100/50">
            <h2 className="text-2xl font-semibold text-green-700 mb-3 font-playfair">Welcome to Garden Watering Tracker!</h2>
            <p className="text-gray-600 text-lg">Enter your ZIP code above to get started.</p>
        </div>
    );
  }

  const loggedWateringEvents = new Map(wateringLogs.map(log => [getLocalDateString(log.timestamp), log]));

  const chartData: FormattedChartDataPoint[] = weatherData.map(day => {
    // Parse day.date (YYYY-MM-DD) as local date
    const [year, monthIdx, dayNum] = day.date.split('-').map(Number);
    const dateObj = new Date(year, monthIdx - 1, dayNum); // month is 0-indexed in new Date()

    const dayNameShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonthStr = dateObj.getDate().toString().padStart(2, '0');
    const formattedName = `${dayNameShort} ${monthStr}/${dayOfMonthStr}`;
    
    const loggedEventForDay = loggedWateringEvents.get(day.date);
    const isWatered = !!loggedEventForDay;

    return {
      name: formattedName, // Updated name format for X-axis
      maxTemp: temperatureUnit === TemperatureUnit.CELSIUS ? day.maxTempC : celsiusToFahrenheit(day.maxTempC),
      minTemp: temperatureUnit === TemperatureUnit.CELSIUS ? day.minTempC : celsiusToFahrenheit(day.minTempC),
      precipitation: parseFloat((day.precipitationMm * MM_TO_INCHES).toFixed(1)),
      sunlightHours: day.sunlightHours,
      manualWatering: isWatered,
      wateringMarkerYValue: isWatered ? 0.05 : undefined,
      wateringAmount: loggedEventForDay?.amount,
      wateringUnit: loggedEventForDay?.unit,
    };
  });

  const latestSunlightHours = weatherData[weatherData.length -1]?.sunlightHours;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100/50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
          {latestSunlightHours !== undefined && (
            <div className="flex items-center text-gray-700 w-full sm:w-auto p-2 bg-green-50 rounded-xl shadow-inner">
              <SunlightDurationIcon className="w-7 h-7 mr-3 text-yellow-600" aria-hidden="true" />
              <span className="text-base md:text-lg font-medium">
                Today's Sunlight: <strong className="text-green-800">{latestSunlightHours.toFixed(1)} hours</strong>
              </span>
            </div>
          )}
          <div className="w-full sm:w-auto">
            <button
              onClick={onToggleUnit}
              className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 text-base md:text-lg whitespace-nowrap"
              aria-label={`Switch to degrees ${temperatureUnit === TemperatureUnit.CELSIUS ? 'Fahrenheit' : 'Celsius'}`}
              title={`Switch to degrees ${temperatureUnit === TemperatureUnit.CELSIUS ? 'Fahrenheit' : 'Celsius'}`}
            >
              <ThermometerIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              Display °{temperatureUnit === TemperatureUnit.CELSIUS ? 'F' : 'C'}
            </button>
          </div>
        </div>
      </div>

      <WateringRecommendation weatherData={weatherData} />
      
      <CombinedWeatherChart data={chartData} unit={temperatureUnit} />
    </div>
  );
};

export default WeatherDisplay;
