
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Power, ShieldCheck } from 'lucide-react';

interface LogoutTransitionProps {
  onComplete: () => void;
}

const LogoutTransition: React.FC<LogoutTransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'spin' | 'lock' | 'implode'>('spin');

  useEffect(() => {
    // Sequence Timeline
    const timer1 = setTimeout(() => setStage('lock'), 1200);   // Stop spinning, show lock
    const timer2 = setTimeout(() => setStage('implode'), 2500); // Shrink away
    const timer3 = setTimeout(onComplete, 3000);                // Finish

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Central Mandala Ring */}
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            stage === 'implode' 
              ? { scale: 0, opacity: 0, transition: { duration: 0.4, ease: "backIn" } } 
              : { scale: 1, opacity: 1 }
          }
        >
          {/* Outer Rotating Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/30"
            animate={stage === 'spin' ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          
          {/* Inner Glowing Ring */}
          <motion.div 
            className="absolute inset-4 rounded-full border-2 border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            animate={stage === 'spin' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 'spin' && (
                <motion.div
                  key="power"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-purple-500"
                >
                  <Power size={48} />
                </motion.div>
              )}
              {stage === 'lock' && (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full" />
                  <Lock size={64} className="text-green-400 relative z-10" />
                  <motion.div 
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-black"
                  >
                    <ShieldCheck size={16} className="text-black" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Text Feedback */}
        <div className="mt-12 h-10 text-center overflow-hidden">
          <AnimatePresence mode="wait">
            {stage === 'spin' && (
              <motion.div
                key="text-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">Disconnecting</h3>
                <p className="text-xs text-purple-400 mt-1">Closing secure channels...</p>
              </motion.div>
            )}
            {stage === 'lock' && (
              <motion.div
                key="text-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-green-400 tracking-widest uppercase">Session Secured</h3>
                <p className="text-xs text-gray-400 mt-1">Data encrypted. See you soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default LogoutTransition;
