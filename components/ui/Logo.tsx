
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", variant = 'default' }) => {
  return (
    <div className={`${className} relative rounded-xl overflow-hidden shadow-lg border border-white/10 group`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 group-hover:scale-110 transition-transform duration-500" />
      
      {/* Logo Text SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5">
          <text 
            x="50" 
            y="68" 
            fontSize="55" 
            fontFamily="Cinzel, serif" 
            fontWeight="900" 
            textAnchor="middle" 
            fill="white"
            className="drop-shadow-md"
          >
            DW
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
