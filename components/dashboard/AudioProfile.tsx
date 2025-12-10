
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, CheckCircle, Volume2 } from 'lucide-react';

const AudioProfile: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle');
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<any>(null);

  // Simulate Recording Timer
  useEffect(() => {
    if (status === 'recording') {
      timerRef.current = setInterval(() => {
        setDuration(prev => Math.min(prev + 1, 60)); // Max 60s
      }, 1000);
    } else if (status === 'idle') {
      setDuration(0);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleRecord = () => {
    setStatus('recording');
  };

  const handleStop = () => {
    setStatus('recorded');
  };

  const handlePlay = () => {
    setStatus('playing');
    setTimeout(() => setStatus('recorded'), duration * 1000); // Simulate playback
  };

  const handleDelete = () => {
    setStatus('idle');
    setDuration(0);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mic size={18} className="text-purple-600" /> Audio Introduction
          </h4>
          <p className="text-xs text-gray-500">Record a 30-60s voice note to introduce yourself.</p>
        </div>
        {status === 'recorded' && (
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={12} /> Saved
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-black/30 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        {/* Controls */}
        <div className="shrink-0">
          {status === 'idle' && (
            <button onClick={handleRecord} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <Mic size={20} />
            </button>
          )}
          {status === 'recording' && (
            <button onClick={handleStop} className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black shadow-lg animate-pulse">
              <Square size={20} />
            </button>
          )}
          {(status === 'recorded' || status === 'playing') && (
            <button onClick={status === 'playing' ? () => setStatus('recorded') : handlePlay} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors">
              {status === 'playing' ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
          )}
        </div>

        {/* Visualizer / Waveform */}
        <div className="flex-1 h-12 flex items-center gap-1 justify-center overflow-hidden bg-gray-50 dark:bg-white/5 rounded-lg px-2">
          {status === 'idle' ? (
            <span className="text-xs text-gray-400 font-medium">Press mic to start recording</span>
          ) : (
            Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                animate={
                  (status === 'recording' || status === 'playing')
                    ? { height: [10, Math.random() * 30 + 10, 10] }
                    : { height: 10 }
                }
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                className={`w-1 rounded-full ${status === 'recording' ? 'bg-red-400' : 'bg-purple-400'}`}
              />
            ))
          )}
        </div>

        {/* Timer & Actions */}
        <div className="shrink-0 text-right min-w-[50px]">
          <div className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
            {formatTime(duration)}
          </div>
          {(status === 'recorded' || status === 'playing') && (
            <button onClick={handleDelete} className="text-xs text-red-500 hover:underline mt-1 flex items-center justify-end gap-1">
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioProfile;
