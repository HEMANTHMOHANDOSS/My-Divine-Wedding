
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, Eye, EyeOff, X, Fingerprint, ChevronRight, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminLogin = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [adminId, setAdminId] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const canvasRef = useRef(null);

  // Polygonal Background Animation (unchanged)
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const points = [];
    const POINT_COUNT = 60;
    const CONNECTION_DISTANCE = 150;

    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw points
      ctx.fillStyle = 'rgba(100, 255, 218, 0.5)'; // Cyan/Teal for security feel
      points.forEach((point, i) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = point.x - p2.x;
          const dy = point.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    
    setTimeout(() => {
      if (adminId === 'ADMIN' && adminKey === 'secure123') {
        setStatus('success');
        setTimeout(() => {
          setIsLoading(false);
          setStatus('idle');
          setAdminId('');
          setAdminKey('');
          if (onLoginSuccess) {
             onLoginSuccess(); // Switch view
          } else {
             onClose();
          }
        }, 1500);
      } else {
        setStatus('error');
        setIsLoading(false);
      }
    }, 2000);
  };

  const fillDemo = () => {
    setAdminId('ADMIN');
    setAdminKey('secure123');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 text-white font-sans"
      >
        {/* Animated Background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0 pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Login Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Decorative Security Elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-400/50">
             <Shield size={16} /> <span className="text-xs tracking-[0.3em] uppercase">Secure Admin Gateway</span>
          </div>

          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            
            {/* Scanning Light Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-shine" />
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />

            {/* Header */}
            <div className="mb-10 text-center relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 mx-auto bg-cyan-900/20 border border-cyan-500/30 rounded-full flex items-center justify-center mb-4 relative"
              >
                {status === 'success' ? (
                  <CheckCircle className="text-green-500 w-8 h-8" />
                ) : (
                  <Fingerprint className="text-cyan-400 w-8 h-8" />
                )}
                <div className={`absolute inset-0 rounded-full border border-cyan-500/20 ${isLoading ? 'animate-ping' : ''}`} />
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Admin Portal</h2>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <Activity size={12} className="text-green-500" /> System Operational
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ID Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Administrator ID</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <Shield size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all duration-300"
                    placeholder="Enter Secure ID"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Access Key</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <Key size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all duration-300"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-900/10 p-2 rounded"
                >
                  <AlertTriangle size={14} /> Access Denied. Invalid Credentials.
                </motion.div>
              )}

              {/* 2FA Placeholder */}
              {status === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20 text-cyan-200 text-xs"
                >
                  <Lock size={14} /> 256-bit Encryption Active
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex items-center justify-center gap-2 p-3 text-green-400 font-bold tracking-wider uppercase"
                >
                  <CheckCircle size={18} /> Access Granted
                </motion.div>
              )}

              {/* Submit Button */}
              {status !== 'success' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`w-full relative py-3.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>Authenticate</span> <ChevronRight size={16} />
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
              )}

            </form>

            {/* Footer & Demo Hint */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">Authorized Personnel Only</p>
              
              {/* Clickable Demo Hint */}
              <button
                type="button"
                onClick={fillDemo}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              >
                <span className="text-[10px] text-cyan-400 font-mono tracking-tight group-hover:text-cyan-300">
                  AUTO-FILL CREDENTIALS: <span className="text-white">"ADMIN"</span> / <span className="text-white">"secure123"</span>
                </span>
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLogin;
