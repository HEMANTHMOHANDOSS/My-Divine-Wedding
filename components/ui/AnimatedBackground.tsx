import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Noise Texture for Film Grain Effect */}
      <div className="absolute inset-0 bg-noise z-[1] opacity-20 mix-blend-overlay" />

      {/* Deep Space / Premium Light Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-purple-50 to-white dark:from-[#050505] dark:via-[#0f0518] dark:to-[#000000] transition-colors duration-1000" />

      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold-400/20 dark:bg-gold-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" 
      />

      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          y: [0, -100, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-300/20 dark:bg-pink-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
      />
      
      {/* Neon Accents for Dark Mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-1000 mix-blend-screen pointer-events-none">
         <div className="absolute top-10 left-10 w-32 h-32 bg-neon-purple blur-[80px] opacity-20 animate-pulse-slow"></div>
         <div className="absolute bottom-20 right-20 w-48 h-48 bg-neon-blue blur-[100px] opacity-10 animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;