
import React from 'react';
import { motion } from 'framer-motion';

interface WeddingAnimationProps {
  className?: string;
}

const WeddingAnimation: React.FC<WeddingAnimationProps> = ({ className = "" }) => {
  const transition = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 3
  };

  return (
    <div className={`relative w-64 h-32 mx-auto lg:mx-0 mb-2 flex items-end justify-center overflow-visible ${className}`}>
      
      {/* --- BRIDE (Left Side) --- */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: -25, opacity: 1 }}
        transition={{ ...transition, duration: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
        className="absolute bottom-0 z-10"
      >
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
           {/* Body/Saree */}
           <path d="M15 80L10 35C10 35 5 25 15 25H45C55 25 50 35 50 35L45 80H15Z" fill="#E11D48" />
           <path d="M15 25L45 80" stroke="#FBBF24" strokeWidth="2" strokeDasharray="2 2" />
           {/* Head */}
           <circle cx="30" cy="18" r="12" fill="#FCA5A5" />
           {/* Hair */}
           <circle cx="30" cy="16" r="13" fill="#1F2937" clipPath="inset(0 0 50% 0)" />
           {/* Jasmine Flowers (Malli) */}
           <path d="M16 16C14 16 12 18 14 20" stroke="white" strokeWidth="3" />
           <path d="M44 16C46 16 48 18 46 20" stroke="white" strokeWidth="3" />
           {/* Hands */}
           <motion.g
              initial={{ rotate: 0, y: 0 }}
              animate={{ rotate: -20, y: -5, x: 5 }}
              transition={{ delay: 2.2, duration: 0.8, repeat: Infinity, repeatDelay: 5.7 }}
           >
              <path d="M45 40L55 35" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" />
           </motion.g>
        </svg>
        
        {/* Bride's Garland (Animation) */}
        <motion.div
           initial={{ opacity: 0, pathLength: 0, scale: 0.5, x: 0, y: 0 }}
           animate={{ 
              opacity: [0, 1, 1, 0], 
              pathLength: [0, 1, 1, 1],
              x: [0, 25, 25, 25], 
              y: [0, -10, 0, 0],
              scale: [0.5, 1, 1, 1]
           }}
           transition={{ delay: 2.2, duration: 1.5, times: [0, 0.4, 0.8, 1], repeat: Infinity, repeatDelay: 5 }}
           className="absolute top-6 left-8 w-12 h-16 pointer-events-none"
        >
           {/* Garland Graphic */}
           <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
              <path d="M5 5 Q 20 50 35 5" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 4" />
              <path d="M5 5 Q 20 50 35 5" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 4" strokeDashoffset="2" />
           </svg>
        </motion.div>
      </motion.div>

      {/* --- GROOM (Right Side) --- */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 25, opacity: 1 }}
        transition={{ ...transition, duration: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
        className="absolute bottom-0 z-10"
      >
        <svg width="60" height="85" viewBox="0 0 60 85" fill="none" xmlns="http://www.w3.org/2000/svg">
           {/* Dhoti/Veshti */}
           <rect x="15" y="50" width="30" height="35" fill="#FFFBEB" stroke="#D1D5DB" />
           {/* Shirt/Kurta */}
           <path d="M10 50L12 25H48L50 50H10Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" />
           {/* Head */}
           <circle cx="30" cy="16" r="12" fill="#FCA5A5" />
           {/* Hair */}
           <path d="M18 12C18 5 42 5 42 12V16H18V12Z" fill="#1F2937" />
           {/* Hands */}
           <motion.g
              initial={{ rotate: 0, y: 0 }}
              animate={{ rotate: 20, y: -5, x: -5 }}
              transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatDelay: 5.7 }}
           >
              <path d="M15 40L5 35" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" />
           </motion.g>
        </svg>

        {/* Groom's Garland (Animation) */}
        <motion.div
           initial={{ opacity: 0, pathLength: 0, scale: 0.5, x: 0, y: 0 }}
           animate={{ 
              opacity: [0, 1, 1, 0], 
              pathLength: [0, 1, 1, 1],
              x: [0, -25, -25, -25], 
              y: [0, -10, 0, 0],
              scale: [0.5, 1, 1, 1]
           }}
           transition={{ delay: 1.5, duration: 1.5, times: [0, 0.4, 0.8, 1], repeat: Infinity, repeatDelay: 5 }}
           className="absolute top-6 -left-8 w-12 h-16 pointer-events-none"
        >
           <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
              <path d="M5 5 Q 20 50 35 5" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 4" />
              <path d="M5 5 Q 20 50 35 5" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 4" strokeDashoffset="2" />
           </svg>
        </motion.div>
      </motion.div>

      {/* --- Heart/Sparkle Explosion --- */}
      <motion.div
         className="absolute top-0 left-1/2 -translate-x-1/2"
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 1.2], y: -20 }}
         transition={{ delay: 3, duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
      >
         <div className="flex gap-2">
            <span className="text-pink-500 text-xl">❤️</span>
            <span className="text-yellow-400 text-sm">✨</span>
         </div>
      </motion.div>

    </div>
  );
};

export default WeddingAnimation;
