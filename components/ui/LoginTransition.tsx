
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, CheckCircle, Crown, Shield, Briefcase, User } from 'lucide-react';

interface LoginTransitionProps {
  role: 'self' | 'parent' | 'broker';
  onComplete: () => void;
}

const LoginTransition: React.FC<LoginTransitionProps> = ({ role, onComplete }) => {
  const [stage, setStage] = useState<'verify' | 'success' | 'portal'>('verify');

  useEffect(() => {
    // Timeline sequence
    const timer1 = setTimeout(() => setStage('success'), 1200); // 1.2s Verify
    const timer2 = setTimeout(() => setStage('portal'), 2200);  // 1s Success display
    const timer3 = setTimeout(onComplete, 3500);               // 1.3s Portal expand & finish

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getRoleConfig = () => {
    switch (role) {
      case 'broker': return { title: 'Partner Portal', icon: <Briefcase size={40} />, color: 'text-emerald-400', bg: 'from-emerald-900 to-black' };
      case 'parent': return { title: 'Parent Dashboard', icon: <Shield size={40} />, color: 'text-blue-400', bg: 'from-blue-900 to-black' };
      default: return { title: 'Divine Connections', icon: <Crown size={40} />, color: 'text-gold-400', bg: 'from-purple-900 to-black' };
    }
  };

  const config = getRoleConfig();

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-40`} />
      
      {/* Animated Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-30 ${role === 'broker' ? 'bg-emerald-500' : 'bg-gold-500'}`}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: 0 
          }}
          animate={{ 
            y: [null, Math.random() * -100],
            scale: [0, Math.random() * 2, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        
        {/* CENTER ICON CONTAINER */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          
          {/* Stage 1: Scanning Ring */}
          {stage === 'verify' && (
            <motion.div 
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 360, scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "linear" }}
              className={`absolute inset-0 rounded-full border-t-4 border-l-4 ${config.color.replace('text-', 'border-')} opacity-50`}
            />
          )}

          {/* Stage 2: Success Ring Pulse */}
          {stage === 'success' && (
            <>
              <motion.div 
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 rounded-full border-2 ${config.color.replace('text-', 'border-')}`}
              />
              <motion.div 
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`absolute inset-0 rounded-full border-2 ${config.color.replace('text-', 'border-')}`}
              />
            </>
          )}

          {/* Stage 3: Portal Expand */}
          {stage === 'portal' && (
             <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 50, opacity: 1 }}
                transition={{ duration: 1.5, ease: "circIn" }}
                className="absolute inset-0 bg-white rounded-full z-50"
             />
          )}

          {/* ICON SWAP ANIMATION */}
          <AnimatePresence mode="wait">
            {stage === 'verify' && (
              <motion.div
                key="fingerprint"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                className={`${config.color}`}
              >
                <Fingerprint size={64} className="animate-pulse" />
              </motion.div>
            )}

            {stage === 'success' && (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 2 }}
                className={`${config.color}`}
              >
                <CheckCircle size={64} />
              </motion.div>
            )}
            
            {stage === 'portal' && (
               <motion.div
                  key="portal-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 180 }}
                  transition={{ duration: 0.8 }}
                  className="text-white z-20"
               >
                  {/* Icon morphs into the portal light */}
                  <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_50px_20px_rgba(255,255,255,0.8)]" />
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TEXT ANIMATIONS */}
        <div className="h-20 text-center relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            {stage === 'verify' && (
              <motion.div
                key="text-verify"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <h2 className="text-xl font-mono text-gray-400 tracking-widest uppercase mb-1">Authenticating</h2>
                <div className="flex gap-1 justify-center">
                   <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                   <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                   <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                </div>
              </motion.div>
            )}

            {stage === 'success' && (
              <motion.div
                key="text-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className={`text-2xl font-display font-bold ${config.color} mb-2`}>Access Granted</h2>
                <p className="text-gray-400 text-sm">Welcome back to {config.title}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default LoginTransition;
