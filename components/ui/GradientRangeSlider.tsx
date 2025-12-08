
import React, { useRef, useState, useEffect } from 'react';

interface GradientRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
  formatLabel?: (value: number) => string;
}

const GradientRangeSlider: React.FC<GradientRangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = "",
  formatLabel = (v) => v.toString()
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  // Convert value to percentage
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const handleStart = (type: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(type);
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const rawValue = min + percent * (max - min);
      
      // Round to step
      const steppedValue = Math.round(rawValue / step) * step;
      
      if (isDragging === 'min') {
        const newVal = Math.min(steppedValue, value[1] - step);
        onChange([Math.max(newVal, min), value[1]]);
      } else {
        const newVal = Math.max(steppedValue, value[0] + step);
        onChange([value[0], Math.min(newVal, max)]);
      }
    };

    const handleEnd = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, min, max, step, value, onChange]);

  const minPercent = getPercent(value[0]);
  const maxPercent = getPercent(value[1]);

  return (
    <div className={`relative w-full h-10 flex items-center select-none ${className}`}>
      <div ref={sliderRef} className="relative w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full">
        
        {/* Active Track (Gradient) */}
        <div 
          className="absolute h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        {/* Min Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-purple-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center"
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleStart('min')}
          onTouchStart={handleStart('min')}
        >
           <div className="w-2 h-2 bg-purple-500 rounded-full" />
           {/* Tooltip */}
           <div className="absolute -top-8 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {formatLabel(value[0])}
           </div>
        </div>

        {/* Max Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-orange-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleStart('max')}
          onTouchStart={handleStart('max')}
        >
           <div className="w-2 h-2 bg-orange-500 rounded-full" />
           {/* Tooltip */}
           <div className="absolute -top-8 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {formatLabel(value[1])}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GradientRangeSlider;
