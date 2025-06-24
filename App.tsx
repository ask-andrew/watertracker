import React, { useState, useEffect, useCallback } from 'react';
import ZipCodeInput from './components/ZipCodeInput';
import WeatherDisplay from './components/WeatherDisplay';
import WateringLog from './components/WateringLog';
import { fetchWeatherData } from './services/weatherService';
import { DailyWeather, WateringEvent, TemperatureUnit, WeatherServiceResponse, WateringUnit } from './types';
import { LOCAL_STORAGE_ZIP_KEY, LOCAL_STORAGE_LOGS_KEY, LOCAL_STORAGE_UNIT_KEY } from './constants';

const App: React.FC = () => {
  const [zipCode, setZipCode] = useState<string>(() => localStorage.getItem(LOCAL_STORAGE_ZIP_KEY) || '');
  const [weatherData, setWeatherData] = useState<DailyWeather[] | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [wateringLogs, setWateringLogs] = useState<WateringEvent[]>(() => {
    const savedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    return savedLogs ? JSON.parse(savedLogs) : [];
  });
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    const savedUnit = localStorage.getItem(LOCAL_STORAGE_UNIT_KEY) as TemperatureUnit | null;
    return savedUnit || TemperatureUnit.FAHRENHEIT;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = useCallback(async (currentZip: string) => {
    if (!currentZip) {
      setWeatherData(null);
      setCityName(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { weatherData: fetchedWeatherData, cityName: fetchedCityName } = await fetchWeatherData(currentZip);
      setWeatherData(fetchedWeatherData);
      setCityName(fetchedCityName);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeatherData(null);
      setCityName(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (zipCode) {
      loadWeatherData(zipCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode]); // loadWeatherData is memoized, only run if zipCode changes

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ZIP_KEY, zipCode);
  }, [zipCode]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(wateringLogs));
  }, [wateringLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_UNIT_KEY, temperatureUnit);
  }, [temperatureUnit]);

  const handleZipCodeSubmit = (newZipCode: string) => {
    setZipCode(newZipCode);
  };

  const handleAddWateringLog = (amount: number, unit: WateringUnit) => {
    const newLog: WateringEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amount,
      unit,
    };
    setWateringLogs((prevLogs: WateringEvent[]) => [newLog, ...prevLogs]);
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prevUnit: TemperatureUnit) => 
      prevUnit === TemperatureUnit.CELSIUS ? TemperatureUnit.FAHRENHEIT : TemperatureUnit.CELSIUS
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-gray-800 font-inter py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-playfair font-bold text-green-800 drop-shadow-lg leading-tight">
          <span role="img" aria-label="seedling emoji" className="mr-2">🌿</span>
          Garden Watering Tracker
        </h1>
        <p className="text-lg text-green-700 mt-2 font-medium">
          Smart watering decisions based on local weather.
        </p>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <ZipCodeInput 
            onSubmit={handleZipCodeSubmit} 
            initialZipCode={zipCode}
            isLoading={isLoading}
            cityName={cityName}
        />
        
        <WeatherDisplay 
            weatherData={weatherData} 
            wateringLogs={wateringLogs}
            temperatureUnit={temperatureUnit}
            onToggleUnit={toggleTemperatureUnit}
            isLoading={isLoading && !weatherData}
            error={error}
        />
        
        <WateringLog logs={wateringLogs} onAddLog={handleAddWateringLog} isLoading={isLoading} />
      </main>

      <footer className="text-center mt-12 py-6 border-t border-green-200">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Garden Watering Tracker. Happy Gardening!
        </p>
      </footer>
    </div>
  );
};

export default App;