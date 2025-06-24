import { RecommendationLogic } from './types';

export const PRECIPITATION_THRESHOLD_MM_48H = 25; // Roughly 1 inch
export const DAYS_OF_DATA = 5;
export const LOCAL_STORAGE_ZIP_KEY = 'gardenApp_zipCode';
export const LOCAL_STORAGE_LOGS_KEY = 'gardenApp_wateringLogs';
export const LOCAL_STORAGE_UNIT_KEY = 'gardenApp_tempUnit';

export const MM_TO_INCHES = 0.0393701;

// Weather API Constants
export const WEATHER_API_KEY = "a43eade663f246439b1153041252905"; // NOTE: In a production app, this should be loaded from an environment variable for security.
export const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1";

export const RECOMMENDATION_MESSAGES: Record<RecommendationLogic, { text: string; color: string; suggestion: string }> = {
  [RecommendationLogic.WATER_NOW]: {
    text: "Watering Recommended",
    color: "text-blue-600",
    suggestion: "Your garden seems thirsty! It's a good time to water."
  },
  [RecommendationLogic.MONITOR_CLOSELY]: {
    text: "Monitor Closely",
    color: "text-yellow-600",
    suggestion: "Weather conditions are moderate. Check your soil and plants."
  },
  [RecommendationLogic.NO_WATERING_NEEDED]: {
    text: "No Watering Needed",
    color: "text-green-600",
    suggestion: "Recent rainfall has likely been sufficient. Hold off on watering."
  },
  [RecommendationLogic.NOT_ENOUGH_DATA]: {
    text: "Enter ZIP for Recommendation",
    color: "text-gray-500",
    suggestion: "Provide your ZIP code to get tailored advice."
  }
};