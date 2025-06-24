import React from 'react';
import { DailyWeather, RecommendationLogic } from '../types';
import { PRECIPITATION_THRESHOLD_MM_48H, RECOMMENDATION_MESSAGES, MM_TO_INCHES } from '../constants';
import WateringCanIcon from './icons/WateringCanIcon';
import SunIcon from './icons/SunIcon'; // For Monitor
import RainIcon from './icons/RainIcon'; // For No Water

const getWateringRecommendation = (weatherData: DailyWeather[] | null): RecommendationLogic => {
  if (!weatherData || weatherData.length < 2) {
    return RecommendationLogic.NOT_ENOUGH_DATA;
  }

  // Get data for the last 2 days (most recent first)
  const lastTwoDays = weatherData.slice(-2);
  const precipLast24hMm = lastTwoDays[lastTwoDays.length - 1]?.precipitationMm ?? 0;
  const precipLast48hMm = lastTwoDays.reduce((sum, day) => sum + (day?.precipitationMm ?? 0), 0);

  if (precipLast24hMm >= PRECIPITATION_THRESHOLD_MM_48H * 0.70) { // 70% of threshold in last 24h
    return RecommendationLogic.NO_WATERING_NEEDED;
  }

  if (precipLast48hMm < PRECIPITATION_THRESHOLD_MM_48H) {
    return RecommendationLogic.WATER_NOW;
  }
  
  return RecommendationLogic.MONITOR_CLOSELY;
};


interface WateringRecommendationProps {
  weatherData: DailyWeather[] | null;
}

const WateringRecommendation: React.FC<WateringRecommendationProps> = ({ weatherData }) => {
  const recommendation = getWateringRecommendation(weatherData);
  const messageDetails = RECOMMENDATION_MESSAGES[recommendation];

  let IconComponent;
  switch (recommendation) {
    case RecommendationLogic.WATER_NOW:
      IconComponent = <WateringCanIcon className={`w-9 h-9 mr-4 ${messageDetails.color}`} />;
      break;
    case RecommendationLogic.MONITOR_CLOSELY:
      IconComponent = <SunIcon className={`w-9 h-9 mr-4 ${messageDetails.color}`} />;
      break;
    case RecommendationLogic.NO_WATERING_NEEDED:
      IconComponent = <RainIcon className={`w-9 h-9 mr-4 ${messageDetails.color}`} />;
      break;
    default:
      IconComponent = <WateringCanIcon className={`w-9 h-9 mr-4 ${messageDetails.color}`} />;
  }
  
  const totalPrecipitationLast48hMm = weatherData ? weatherData.slice(-2).reduce((sum, day) => sum + day.precipitationMm, 0) : 0;
  const totalPrecipitationLast48hInches = (totalPrecipitationLast48hMm * MM_TO_INCHES).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100/50 text-center">
      <h3 className="text-xl font-semibold text-green-800 mb-3 font-playfair">Watering Advice</h3>
      <div className="flex items-center justify-center mb-3">
        {IconComponent}
        <p className={`text-3xl font-bold ${messageDetails.color}`}>
          {messageDetails.text}
        </p>
      </div>
      <p className="text-gray-600 text-base mb-2 font-medium">{messageDetails.suggestion}</p>
      {weatherData && weatherData.length > 0 && recommendation !== RecommendationLogic.NOT_ENOUGH_DATA && (
         <p className="text-xs text-gray-500 font-inter">
           Based on approx. <span className="font-semibold">{totalPrecipitationLast48hInches} inches</span> of rainfall in the last 48 hours.
         </p>
      )}
    </div>
  );
};

export default WateringRecommendation;