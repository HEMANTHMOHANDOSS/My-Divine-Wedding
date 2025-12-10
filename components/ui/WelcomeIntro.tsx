
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface WelcomeIntroProps {
  onComplete: () => void;
}

const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onComplete }) => {
  useEffect(() => {
    // Total animation duration before unmounting
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Left Curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[50%] bg-[#0f0518] z-20 flex items-center justify-end border-r border-white/5"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ delay: 2.8, duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
         <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-50" />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-[50%] bg-[#0f0518] z-20 flex items-center justify-start border-l border-white/5"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ delay: 2.8, duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
         <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-50" />
      </motion.div>

      {/* Center Content (Fades out before curtains open) */}
      <motion.div
        className="relative z-30 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ 
             opacity: [0, 1, 1, 0],
             scale: [0.8, 1, 1, 1.2]
          }}
          transition={{ duration: 2.8, times: [0, 0.2, 0.8, 1] }}
          className="flex flex-col items-center"
        >
           <div className="relative mb-8">
              <motion.div 
                 className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full"
                 animate={{ scale: [1, 1.5, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
              />
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 rotate-12 border border-white/10">
                 <Logo className="w-20 h-20" />
              </div>
           </div>
           
           <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
                 My Divine <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-500">Wedding</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                 <p className="text-purple-200 text-sm uppercase tracking-[0.4em] font-light">Uniting Souls</p>
                 <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
              </div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeIntro;
