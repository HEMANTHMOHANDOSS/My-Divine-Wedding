
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Phone, Video, Heart, AlertTriangle, Search, Filter, 
  Eye, XCircle, Shield, Flag, Lock, Clock, CheckCircle, Ban 
} from 'lucide-react';
import { AdminTable } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { KpiCard } from './AdminWidgets';
import { MOCK_COMMUNICATION_LOGS, COMMUNICATION_STATS } from '../../utils/adminData';

const AdminCommunication = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedContent, setRevealedContent] = useState(null);

  // Filter Logic
  const filteredLogs = MOCK_COMMUNICATION_LOGS.filter(log => {
    let matchesTab = true;
    if (activeTab === 'flagged') matchesTab = log.status === 'flagged' || log.riskScore > 50;
    if (activeTab === 'calls') matchesTab = log.type === 'audio_call' || log.type === 'video_call';
    
    const matchesSearch = log.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (action, id) => {
    alert(`${action} performed on Interaction ${id}`);
    setSelectedLog(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'chat': return <MessageSquare size={16} className="text-blue-500" />;
      case 'audio_call': return <Phone size={16} className="text-green-500" />;
      case 'video_call': return <Video size={16} className="text-purple-500" />;
      case 'interest': return <Heart size={16} className="text-pink-500" />;
      default: return <MessageSquare size={16} />;
    }
  };

  const columns = [
    { key: 'senderName', label: 'Participants', sortable: true, render: (_, log) => (
       <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <span className="font-bold text-gray-900 dark:text-white text-sm">{log.senderName}</span>
             <span className="text-[10px] text-gray-400">to</span>
             <span className="font-bold text-gray-900 dark:text-white text-sm">{log.receiverName}</span>
          </div>
          <div className="text-[10px] text-gray-500">{log.senderId} → {log.receiverId}</div>
       </div>
    )},
    { key: 'type', label: 'Type', sortable: true, render: (val) => (
       <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg">{getTypeIcon(val)}</div>
          <span className="text-xs font-bold capitalize">{val.replace('_', ' ')}</span>
       </div>
    )},
    { key: 'riskScore', label: 'Risk Analysis', sortable: true, render: (val) => (
       <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-[10px] font-bold">
             <span className="text-gray-500">Score</span>
             <span className={val > 50 ? 'text-red-500' : 'text-green-500'}>{val}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
             <div className={`h-full ${val > 80 ? 'bg-red-500' : val > 40 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${val}%` }} />
          </div>
       </div>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (val) => (
       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          val === 'flagged' ? 'bg-red-100 text-red-600' : 
          val === 'blocked' ? 'bg-gray-100 text-gray-600' : 
          'bg-green-100 text-green-600'
       }`}>
          {val}
       </span>
    )},
    { key: 'timestamp', label: 'Time', sortable: true, render: (val) => <span className="text-xs text-gray-500 font-mono">{val}</span> },
    { key: 'metadata', label: 'Preview', render: (val) => (
       <span className="text-xs text-gray-500 italic max-w-[150px] truncate block">
          {val.duration ? `Duration: ${val.duration}` : val.contentSnippet || 'No content'}
       </span>
    )}
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
         <KpiCard title="Total Messages" value={COMMUNICATION_STATS.totalMessages.toLocaleString()} trend="+5%" icon={<MessageSquare size={24} />} color="bg-blue-500" />
         <KpiCard title="Active Calls" value={COMMUNICATION_STATS.activeCalls.toString()} trend="Live" icon={<Phone size={24} />} color="bg-green-500" />
         <KpiCard title="Flagged" value={COMMUNICATION_STATS.flaggedInteractions.toString()} trend="+2" icon={<AlertTriangle size={24} />} color="bg-red-500" />
         <KpiCard title="Avg Response" value={COMMUNICATION_STATS.avgResponseTime} trend="-10s" icon={<Clock size={24} />} color="bg-purple-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden">
         
         {/* Controls */}
         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
               {['all', 'flagged', 'calls'].map(tab => (
                  <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            <div className="relative w-full md:w-64">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search user..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
               />
            </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-hidden">
            <AdminTable 
               data={filteredLogs}
               columns={columns}
               enableSearch={false}
               enableExport={true}
               actions={(item) => (
                  <button 
                     onClick={() => setSelectedLog(item)}
                     className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-600 transition-colors flex items-center gap-1"
                  >
                     <Eye size={12} /> Inspect
                  </button>
               )}
            />
         </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
         {selectedLog && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => { setSelectedLog(null); setRevealedContent(null); }}
               />
               <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
               >
                  <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                     <h3 className="font-bold text-lg flex items-center gap-2">
                        {getTypeIcon(selectedLog.type)} Interaction Log
                     </h3>
                     <button onClick={() => { setSelectedLog(null); setRevealedContent(null); }} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"><XCircle size={20} /></button>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                        <div className="text-center">
                           <p className="text-sm font-bold">{selectedLog.senderName}</p>
                           <p className="text-xs text-gray-500">{selectedLog.senderId}</p>
                        </div>
                        <div className="text-purple-500 font-bold">VS</div>
                        <div className="text-center">
                           <p className="text-sm font-bold">{selectedLog.receiverName}</p>
                           <p className="text-xs text-gray-500">{selectedLog.receiverId}</p>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500">Content Analysis</h4>
                        <div className={`p-4 rounded-xl border ${selectedLog.riskScore > 50 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-sm">Risk Score</span>
                              <span className="text-lg font-bold">{selectedLog.riskScore}%</span>
                           </div>
                           <p className="text-xs opacity-80">
                              {selectedLog.riskScore > 50 
                               ? "Flagged for suspicious patterns or restricted keywords." 
                               : "Interaction appears normal and safe."}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                           <Lock size={12} /> Secure Content
                        </h4>
                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-xl text-sm relative overflow-hidden min-h-[80px] flex items-center justify-center text-center">
                           {revealedContent === selectedLog.id ? (
                              <p className="text-gray-800 dark:text-gray-200 italic text-left w-full">
                                 "{selectedLog.metadata.fullContent || 'Call duration: ' + selectedLog.metadata.duration}"
                              </p>
                           ) : (
                              <div className="space-y-2">
                                 <Shield size={24} className="mx-auto text-gray-400" />
                                 <p className="text-xs text-gray-500">Content hidden for privacy.</p>
                                 <button 
                                    onClick={() => setRevealedContent(selectedLog.id)}
                                    className="text-xs font-bold text-purple-600 hover:underline"
                                 >
                                    Reveal Content
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button 
                           onClick={() => handleAction('dismiss', selectedLog.id)}
                           className="flex-1 py-3 text-gray-600 font-bold text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                           Dismiss
                        </button>
                        <button 
                           onClick={() => handleAction('flag', selectedLog.id)}
                           className="flex-1 py-3 text-orange-600 font-bold text-sm rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                        >
                           <Flag size={16} /> Flag
                        </button>
                        <button 
                           onClick={() => handleAction('block', selectedLog.senderId)}
                           className="flex-1 py-3 text-white font-bold text-sm rounded-xl bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                        >
                           <Ban size={16} /> Block User
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default AdminCommunication;
