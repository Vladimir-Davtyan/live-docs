'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react'; 

function ThemeToggleButton() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      setIsLightTheme(true);
    } else {
      document.documentElement.classList.remove('light-theme');
      setIsLightTheme(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isLightTheme) {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
    setIsLightTheme(!isLightTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="w-[40px] h-[40px] relative flex items-center justify-center p-2 rounded-full bg-transparent transition-colors duration-300"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
        <SunIcon
          className={`w-6 h-6 text-yellow-500 transform transition-transform ${
            isLightTheme ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
          }`}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
        <MoonIcon
          className={`w-6 h-6 text-blue-500 transform transition-transform ${
            isLightTheme ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
          }`}
        />
      </div>
    </button>
  );
}

export default ThemeToggleButton;
