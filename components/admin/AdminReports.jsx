
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Shield, CheckCircle, XCircle, Search, Filter, 
  Flag, MessageSquare, UserX, Eye, Lock, ChevronRight, Activity, 
  BarChart2, Clock, Trash2, Ban
} from 'lucide-react';
import { AdminTable } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { KpiCard, SimpleBarChart } from './AdminWidgets';
import { MOCK_REPORTS, SAFETY_ANALYTICS } from '../../utils/adminData';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering
  const filteredReports = MOCK_REPORTS.filter(r => {
    const matchesTab = activeTab === 'open' ? (r.status === 'open' || r.status === 'investigating') : r.status === activeTab;
    const matchesSearch = r.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (action, ticketId) => {
    // In a real app, this would update the backend
    alert(`${action.toUpperCase()} applied to Ticket ${ticketId}`);
    setSelectedTicket(null);
  };

  const columns = [
    { key: 'reportedUser', label: 'Reported User', sortable: true, render: (_, r) => (
       <div className="flex items-center gap-3">
          <img src={r.reportedUserAvatar} className="w-8 h-8 rounded-full object-cover" />
          <div>
             <div className="font-bold text-gray-900 dark:text-white text-sm">{r.reportedUser}</div>
             <div className="text-[10px] text-gray-500">{r.reportedUserId}</div>
          </div>
       </div>
    )},
    { key: 'category', label: 'Violation Type', sortable: true, render: (val) => (
       <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{val}</span>
    )},
    { key: 'severity', label: 'Risk Level', sortable: true, render: (val) => (
       <div className={`flex items-center gap-1 text-xs font-bold uppercase ${
          val === 'critical' ? 'text-red-600' : val === 'high' ? 'text-orange-600' : 'text-yellow-600'
       }`}>
          <div className={`w-2 h-2 rounded-full ${
             val === 'critical' ? 'bg-red-600 animate-pulse' : val === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
          }`} />
          {val}
       </div>
    )},
    { key: 'aiRiskScore', label: 'AI Score', sortable: true, render: (val) => (
       <div className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden" title={`${val}% Risk`}>
          <div 
             className={`h-full ${val > 80 ? 'bg-red-500' : val > 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
             style={{ width: `${val}%` }} 
          />
       </div>
    )},
    { key: 'timestamp', label: 'Time', render: (val) => <span className="text-xs text-gray-500">{val}</span> }
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      
      {/* Top Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
         <KpiCard 
            title="Active Reports" value="12" trend="+2" icon={<Flag size={24} />} color="bg-red-500" 
         />
         <KpiCard 
            title="Avg Resolution" value="2.5h" trend="-15%" icon={<Clock size={24} />} color="bg-blue-500" 
         />
         <KpiCard 
            title="Auto-Flagged" value="45%" trend="+5%" icon={<Activity size={24} />} color="bg-purple-500" 
         />
         <KpiCard 
            title="Safe Users" value="98.5%" trend="+0.2%" icon={<Shield size={24} />} color="bg-green-500" 
         />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 shrink-0 h-[300px]">
         <div className="lg:col-span-2 bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg flex flex-col">
            <h3 className="font-bold text-lg mb-4">Reports by Category</h3>
            <div className="flex-1 w-full flex items-end justify-between gap-4 px-4">
               {SAFETY_ANALYTICS.reportsByType.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                     <div className="text-xs font-bold">{d.count}</div>
                     <motion.div 
                        initial={{ height: 0 }} animate={{ height: `${(d.count / 50) * 100}%` }}
                        className="w-full bg-red-500/80 rounded-t-md relative group-hover:bg-red-500 transition-colors"
                     />
                     <div className="text-[10px] text-gray-500 font-bold uppercase truncate w-full text-center">{d.type}</div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg flex flex-col justify-center items-center">
            <h3 className="font-bold text-lg mb-6 self-start">Resolution Status</h3>
            <div className="relative w-40 h-40">
               <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20" strokeDasharray="180 251" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="60 251" strokeDashoffset="-180" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">177</span>
                  <span className="text-[10px] uppercase text-gray-500">Total Cases</span>
               </div>
            </div>
            <div className="flex gap-4 mt-6 text-xs font-bold">
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Resolved</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Pending</div>
            </div>
         </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden">
         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
               {['open', 'resolved', 'dismissed'].map(tab => (
                  <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            <div className="relative w-full md:w-64">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search reports..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-red-500"
               />
            </div>
         </div>

         <div className="flex-1 overflow-hidden">
            <AdminTable 
               data={filteredReports}
               columns={columns}
               enableSearch={false}
               enableExport={false}
               actions={(item) => (
                  <button 
                     onClick={() => setSelectedTicket(item)}
                     className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-1"
                  >
                     <Eye size={12} /> Review
                  </button>
               )}
            />
         </div>
      </div>

      {/* Investigation Modal */}
      <AnimatePresence>
         {selectedTicket && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setSelectedTicket(null)}
               />
               <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
               >
                  {/* Left: Profile & Report Info */}
                  <div className="w-full md:w-1/3 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-6 overflow-y-auto">
                     <div className="flex items-center gap-4 mb-6">
                        <img src={selectedTicket.reportedUserAvatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                        <div>
                           <h3 className="font-bold text-lg">{selectedTicket.reportedUser}</h3>
                           <p className="text-xs text-gray-500">{selectedTicket.reportedUserId}</p>
                           <div className="flex gap-2 mt-2">
                              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">{selectedTicket.category}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10">
                           <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Reported By</h4>
                           <p className="font-bold text-sm">{selectedTicket.reporter}</p>
                           <p className="text-xs text-gray-400 mt-1">{selectedTicket.timestamp}</p>
                        </div>

                        <div className="p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10">
                           <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Reason</h4>
                           <p className="text-sm italic">"{selectedTicket.reason}"</p>
                        </div>

                        {selectedTicket.aiFlag && (
                           <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
                              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-2">
                                 <AlertTriangle size={16} /> AI Flagged High Risk
                              </div>
                              <p className="text-xs text-red-700 dark:text-red-300">
                                 This user has a risk score of {selectedTicket.aiRiskScore}%. Pattern matches known spam behavior.
                              </p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Right: Evidence & Actions */}
                  <div className="flex-1 flex flex-col">
                     <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-black/40">
                        <h4 className="font-bold text-gray-500 uppercase text-xs mb-4 flex items-center gap-2">
                           <MessageSquare size={14} /> Evidence Log
                        </h4>
                        
                        {selectedTicket.evidence?.chatLogs ? (
                           <div className="space-y-3">
                              {selectedTicket.evidence.chatLogs.map((log, i) => (
                                 <div key={i} className={`flex flex-col ${log.sender === selectedTicket.reportedUser ? 'items-start' : 'items-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${log.sender === selectedTicket.reportedUser ? 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'}`}>
                                       <span className="text-[10px] font-bold opacity-50 block mb-1">{log.sender}</span>
                                       {log.text}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1">{log.time}</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                              <Lock size={32} className="mb-2" />
                              <p className="text-sm">No chat evidence available.</p>
                           </div>
                        )}
                     </div>

                     <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10">
                        <h4 className="font-bold mb-4">Take Action</h4>
                        <div className="grid grid-cols-3 gap-4">
                           <button 
                              onClick={() => handleAction('dismiss', selectedTicket.id)}
                              className="py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                           >
                              <Trash2 size={16} /> Dismiss
                           </button>
                           <button 
                              onClick={() => handleAction('warn', selectedTicket.id)}
                              className="py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 text-orange-600 font-bold rounded-xl text-sm flex items-center justify-center gap-2 border border-orange-200 dark:border-orange-900/30"
                           >
                              <AlertTriangle size={16} /> Send Warning
                           </button>
                           <button 
                              onClick={() => handleAction('ban', selectedTicket.id)}
                              className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                           >
                              <Ban size={16} /> Block User
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default AdminReports;
