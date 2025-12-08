
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, XCircle, AlertTriangle, Shield, Flag } from 'lucide-react';
import { MOCK_MODERATION, ModerationItem } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';

const AdminModeration: React.FC = () => {
  const [queue, setQueue] = useState<ModerationItem[]>(MOCK_MODERATION);
  const currentItem = queue[0];

  const handleDecision = (decision: 'Approved' | 'Rejected') => {
     alert(`${decision} ${currentItem.type} for ${currentItem.userName}`);
     setQueue(prev => prev.slice(1));
  };

  if (!currentItem) return (
     <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <CheckCircle size={64} className="text-green-500 mb-4 opacity-50" />
        <h3 className="text-xl font-bold">All Caught Up!</h3>
        <p>No pending content for moderation.</p>
     </div>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
       <div className="w-full bg-white dark:bg-[#121212] rounded-[3rem] shadow-2xl border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col md:flex-row h-[70vh]">
          {/* Content Preview */}
          <div className="w-full md:w-1/2 bg-black relative flex items-center justify-center">
             {currentItem.type === 'Photo' ? (
                <img src={currentItem.content} className="max-w-full max-h-full object-contain" />
             ) : (
                <div className="p-8 text-white text-center">
                   <h4 className="text-gray-400 uppercase text-xs font-bold mb-4 tracking-widest">User Bio Content</h4>
                   <p className="text-lg font-medium leading-relaxed">"{currentItem.content}"</p>
                </div>
             )}
             
             {/* Overlay Info */}
             <div className="absolute top-4 left-4 flex items-center gap-3">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{currentItem.type}</span>
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">{currentItem.userName}</span>
             </div>
          </div>

          {/* Analysis & Controls */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
             <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="text-purple-600" /> AI Safety Analysis</h3>
                
                <div className={`p-6 rounded-3xl mb-6 ${currentItem.aiScore > 70 ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30' : 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30'}`}>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Risk Score</span>
                      <span className={`text-3xl font-bold ${currentItem.aiScore > 70 ? 'text-red-600' : 'text-green-600'}`}>{currentItem.aiScore}/100</span>
                   </div>
                   <div className="w-full h-2 bg-gray-200 dark:bg-black/20 rounded-full overflow-hidden">
                      <div className={`h-full ${currentItem.aiScore > 70 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${currentItem.aiScore}%` }} />
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-sm font-bold text-gray-500 uppercase">Flags Detected</h4>
                   {currentItem.flags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                         {currentItem.flags.map(flag => (
                            <span key={flag} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold flex items-center gap-1">
                               <Flag size={12} /> {flag}
                            </span>
                         ))}
                      </div>
                   ) : (
                      <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle size={16} /> No explicit content detected.</p>
                   )}
                </div>
             </div>

             <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                <button 
                   onClick={() => handleDecision('Rejected')}
                   className="flex-1 py-4 border-2 border-red-100 dark:border-red-900/30 text-red-600 font-bold rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex flex-col items-center gap-1"
                >
                   <XCircle size={24} /> Reject
                </button>
                <button 
                   onClick={() => handleDecision('Approved')}
                   className="flex-1 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 shadow-lg shadow-green-500/30 transition-colors flex flex-col items-center gap-1"
                >
                   <CheckCircle size={24} /> Approve
                </button>
             </div>
          </div>
       </div>
       <p className="mt-4 text-gray-400 text-xs font-bold uppercase tracking-widest">{queue.length - 1} items remaining in queue</p>
    </div>
  );
};

export default AdminModeration;
