import React, { useState } from 'react';

interface ZipCodeInputProps {
  onSubmit: (zipCode: string) => void;
  initialZipCode: string;
  isLoading: boolean;
  cityName: string | null;
}

const ZipCodeInput: React.FC<ZipCodeInputProps> = ({ onSubmit, initialZipCode, isLoading, cityName }) => {
  const [zip, setZip] = useState(initialZipCode);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setError('');
    onSubmit(zip);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-green-100/50">
      <label htmlFor="zipcode" className="block text-lg font-semibold text-green-800 mb-3">
        Enter Your 5-Digit ZIP Code
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="text"
          id="zipcode"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="e.g., 90210"
          maxLength={5}
          className="w-full sm:w-auto flex-grow px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ease-in-out placeholder-gray-400 text-gray-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLoading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600 text-center font-medium">{error}</p>}
      {cityName && !isLoading && !error && (
        <p className="mt-3 text-lg text-gray-700 text-center">
          Weather for: <span className="font-bold text-green-700">{cityName}</span>
        </p>
      )}
    </form>
  );
};

export default ZipCodeInput;
