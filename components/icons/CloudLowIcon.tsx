import React from 'react';
import { CloudIcon } from '@heroicons/react/24/outline';

const CloudLowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CloudIcon className={`w-6 h-6 ${className}`} />
);

export default CloudLowIcon;
