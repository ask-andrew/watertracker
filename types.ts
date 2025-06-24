export interface DailyWeather {
  date: string; // YYYY-MM-DD
  name: string; // e.g., "Mon"
  maxTempC: number;
  minTempC: number;
  precipitationMm: number;
  sunlightHours: number; // Added: hours of sunlight
}

export interface WateringEvent {
  id: string;
  timestamp: number; // Unix timestamp
  amount?: number; // Optional: amount of water applied
  unit?: WateringUnit; // Optional: unit of water (e.g., liters, gallons)
}

export enum WateringUnit {
  LITERS = "L",
  GALLONS = "gal",
  MINUTES = "min", // For duration-based watering
}

export enum TemperatureUnit {
  CELSIUS = 'C',
  FAHRENHEIT = 'F',
}

export interface FormattedChartDataPoint {
  name: string; // Day name for X-axis
  maxTemp: number;
  minTemp: number;
  precipitation: number; // Will now be in inches for display
  sunlightHours: number; 
  manualWatering?: boolean; // Added: flag for manual watering on this day
  wateringMarkerYValue?: number; // Added: Y-value for scatter plot marker
  wateringAmount?: number; // Added: amount of manual watering
  wateringUnit?: WateringUnit; // Added: unit of manual watering
}

export enum RecommendationLogic {
  WATER_NOW = "WATER_NOW",
  MONITOR_CLOSELY = "MONITOR_CLOSELY",
  NO_WATERING_NEEDED = "NO_WATERING_NEEDED",
  NOT_ENOUGH_DATA = "NOT_ENOUGH_DATA"
}

export interface WeatherServiceResponse {
  weatherData: DailyWeather[];
  cityName: string;
}