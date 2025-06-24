import React from 'react';
import { SunIcon } from '@heroicons/react/24/outline';

const SunlightDurationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SunIcon className={`w-5 h-5 ${className}`} />
);

export default SunlightDurationIcon;