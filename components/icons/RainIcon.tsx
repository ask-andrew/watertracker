import React from 'react';
import { CloudIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const RainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className}`}>
    <CloudIcon className="w-full h-full text-blue-500" />
    <AcademicCapIcon className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 text-blue-600" style={{ transform: 'translateX(-50%) translateY(30%)' }} />
  </div>
);

export default RainIcon;
