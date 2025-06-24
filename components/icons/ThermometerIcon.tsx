
import React from 'react';

const ThermometerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`w-5 h-5 ${className}`}
  >
    <path fillRule="evenodd" d="M12.25.75A2.25 2.25 0 0010 3v9.338A4.505 4.505 0 008.25 16.5a4.5 4.5 0 004.5 4.5 4.5 4.5 0 004.5-4.5c0-.859-.243-1.652-.667-2.317V3A2.25 2.25 0 0012.25.75zm0 13.5a.75.75 0 01.75.75v1.652a3.001 3.001 0 01-1.5-.001V15a.75.75 0 01.75-.75zm-.75-12V12h1.5V2.25A.75.75 0 0012.25 1.5h-.75z" clipRule="evenodd" />
  </svg>
);

export default ThermometerIcon;
