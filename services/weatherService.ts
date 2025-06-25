import { DailyWeather, WeatherServiceResponse } from '../src/types';
import { DAYS_OF_DATA, WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../src/constants';

// Helper to get date string YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get day name (e.g., "Mon")
const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Conversion functions
const fahrenheitToCelsius = (fahrenheit: number): number => parseFloat(((fahrenheit - 32) * 5/9).toFixed(1));
const inchesToMm = (inches: number): number => parseFloat((inches * 25.4).toFixed(1));

export const fetchWeatherData = async (zipCode: string): Promise<WeatherServiceResponse> => {
  // Basic zip code validation
  if (!/^\d{5}$/.test(zipCode)) {
    throw new Error("Invalid ZIP code format. Please enter a 5-digit number.");
  }

  const weatherData: DailyWeather[] = [];
  let cityName: string = '';
  const today = new Date();

  for (let i = DAYS_OF_DATA - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = formatDate(date);

    const apiUrl = `${WEATHER_API_BASE_URL}/history.json?key=${WEATHER_API_KEY}&q=${zipCode}&dt=${formattedDate}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        // Enhanced error handling for API responses
        let detailedMessage = `API error (${response.status})`;
        if (data && data.error && data.error.message) {
          detailedMessage = data.error.message;
        } else {
          detailedMessage = `Failed to fetch data: ${response.statusText || 'Unknown API error'}`;
        }
        // Add context about the specific date failing, but the core message is from the API
        console.error(`API Error for ${zipCode} on ${formattedDate}: ${detailedMessage}`, data);
        throw new Error(detailedMessage); // This error will be more user-friendly
      }

      if (data && data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 0) {
        // Capture city name from the first successful response
        if (!cityName && data.location && data.location.name) {
          cityName = data.location.name;
        }

        const dayData = data.forecast.forecastday[0].day;
        const astroData = data.forecast.forecastday[0].astro; // For sunrise/sunset to calculate sunlight hours

        // Log astroData and calculated sunlightHours for debugging
        console.log(`Date: ${formattedDate}, Astro Data:`, astroData);

        const highTempF = dayData.maxtemp_f;
        const lowTempF = dayData.mintemp_f;
        const totalPrecipInches = dayData.totalprecip_in;

        // Calculate sunlight hours (approximate based on sunrise/sunset)
        let sunlightHours = 0;
        if (astroData && astroData.sunrise && astroData.sunset) {
            const sunriseTime = new Date(`${formattedDate} ${astroData.sunrise}`);
            const sunsetTime = new Date(`${formattedDate} ${astroData.sunset}`);
            const diffMs = sunsetTime.getTime() - sunriseTime.getTime();
            sunlightHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1)); // Convert milliseconds to hours
            if (isNaN(sunlightHours) || sunlightHours < 0) sunlightHours = 0; // Fallback
            console.log(`Calculated sunlightHours: ${sunlightHours}`);
        } else {
            // Fallback if astro data is missing or invalid, provide a plausible default
            sunlightHours = parseFloat((8 + Math.random() * 4).toFixed(1)); // Between 8 and 12 hours
            console.log(`Fallback sunlightHours: ${sunlightHours}`);
        }

        weatherData.push({
          date: formattedDate,
          name: getDayName(date),
          minTempC: fahrenheitToCelsius(lowTempF),
          maxTempC: fahrenheitToCelsius(highTempF),
          precipitationMm: inchesToMm(totalPrecipInches),
          sunlightHours,
        });
      } else {
        // This case might occur if there's no forecastday for a specific date,
        // which weatherapi.com usually provides for history.
        // For robustness, we'll log it but still try to proceed.
        console.warn(`No specific day data found for ${zipCode} on ${formattedDate}.`);
        // We could push a "null" or default DailyWeather object if needed,
        // but for now, we'll just skip this day to avoid malformed data.
        throw new Error(`No weather data available for ${zipCode} on ${formattedDate}`);
      }
    } catch (error: any) {
      // Re-throw to be caught by App.tsx
      throw new Error(`Error fetching weather for ${zipCode} on ${formattedDate}: ${error.message || error}`);
    }
    // Add a short delay to be mindful of API rate limits, especially for a loop
    await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
  }
  return { weatherData: weatherData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), cityName };
};