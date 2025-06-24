import React, { useState } from 'react';
import { WateringEvent, WateringUnit } from '../types';
import WateringCanIcon from './icons/WateringCanIcon';

interface WateringLogProps {
  logs: WateringEvent[];
  onAddLog: (amount: number, unit: WateringUnit) => void;
  isLoading: boolean;
}

const WateringLog: React.FC<WateringLogProps> = ({ logs, onAddLog, isLoading }) => {
  const [amount, setAmount] = useState<number>(10);
  const [unit, setUnit] = useState<WateringUnit>(WateringUnit.LITERS);

  const handleLogClick = () => {
    if (amount <= 0 || isNaN(amount)) {
      alert("Please enter a valid watering amount.");
      return;
    }
    onAddLog(amount, unit);
    setAmount(10); // Reset amount after logging
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-green-800 flex items-center font-playfair">
          <WateringCanIcon className="w-7 h-7 mr-3 text-blue-600" />
          My Watering Log
        </h3>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0"
            step="0.1"
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base text-gray-800"
            aria-label="Watering amount"
            disabled={isLoading}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as WateringUnit)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base text-gray-800"
            aria-label="Watering unit"
            disabled={isLoading}
          >
            {Object.values(WateringUnit).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <button
            onClick={handleLogClick}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Logging...' : 'Log Watering'}
          </button>
        </div>
      </div>
      {logs.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">No watering events logged yet. Click "Log Watering" to add one.</p>
      ) : (
        <ul className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {logs.slice().sort((a,b) => b.timestamp - a.timestamp).map((log) => (
            <li key={log.id} className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="font-semibold text-green-800">Watered on:</span>{' '}
                <span className="text-gray-700 font-medium">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              {log.amount !== undefined && log.unit && (
                <span className="ml-2 text-sm text-gray-600 font-bold bg-green-200 px-3 py-1 rounded-full">{log.amount} {log.unit}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WateringLog;
