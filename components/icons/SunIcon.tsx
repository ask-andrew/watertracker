import React from 'react';
import { SunIcon as HeroSunIcon } from '@heroicons/react/24/outline';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <HeroSunIcon className={`w-6 h-6 ${className}`} />
);

export default SunIcon;
