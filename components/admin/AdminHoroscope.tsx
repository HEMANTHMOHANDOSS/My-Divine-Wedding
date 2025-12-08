
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Star, Search, Filter, CheckCircle, XCircle, Eye, 
  FileText, RotateCcw, AlertTriangle, Sparkles, Download
} from 'lucide-react';
import { MOCK_HOROSCOPE_SUBMISSIONS, HoroscopeSubmission } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';

const AdminHoroscope: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedItem, setSelectedItem] = useState<HoroscopeSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRaasi, setFilterRaasi] = useState('all');

  // Filter Logic
  const filteredData = MOCK_HOROSCOPE_SUBMISSIONS.filter(item => {
    const matchesTab = item.status === activeTab;
    const matchesSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRaasi = filterRaasi === 'all' || item.raasi === filterRaasi;
    return matchesTab && matchesSearch && matchesRaasi;
  });

  const handleAction = (action: string) => {
    alert(`${action} performed on Horoscope ID: ${selectedItem?.id}`);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {['pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab} {tab === 'pending' && <span className="ml-2 bg-purple-500 text-white text-[10px] px-1.5 rounded-full">{MOCK_HOROSCOPE_SUBMISSIONS.filter(i => i.status === 'pending').length}</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search User..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative group">
             <button className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
               <Filter size={18} />
             </button>
             <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-10 p-1">
                {['all', 'Mesha', 'Simha', 'Kanya', 'Thula'].map(r => (
                   <button key={r} onClick={() => setFilterRaasi(r)} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-white/10">{r}</button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
            {filteredData.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                   <img src={item.userAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-white/10" />
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.userName}</h4>
                      <p className="text-xs text-gray-500">ID: {item.userId}</p>
                   </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/20 mb-4">
                   <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
                         <Moon size={12} /> {item.raasi}
                      </div>
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
                         <Star size={12} /> {item.nakshatra}
                      </div>
                   </div>
                   <div className="text-xs text-gray-500 flex justify-between pt-2 border-t border-purple-200 dark:border-white/5">
                      <span>Lagnam: {item.lagnam}</span>
                      <span>Dosham: {item.dosham}</span>
                   </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
                   <span>Submitted: {item.submittedAt}</span>
                   <span className={`font-bold flex items-center gap-1 ${item.aiMatchScore > 80 ? 'text-green-500' : 'text-amber-500'}`}>
                      <Sparkles size={10} /> AI Match: {item.aiMatchScore}%
                   </span>
                </div>

                <button 
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Review Chart
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <Moon size={48} className="opacity-20 mb-4" />
             <p>No horoscopes found in this category.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
         {selectedItem && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setSelectedItem(null)}
               />
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }}
                  className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
               >
                  {/* Left: Info */}
                  <div className="w-full md:w-1/3 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-6 overflow-y-auto">
                     <h3 className="text-xl font-bold mb-6">Horoscope Verification</h3>
                     
                     <div className="space-y-6">
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                           <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">User Details</h4>
                           <div className="flex items-center gap-3 mb-2">
                              <img src={selectedItem.userAvatar} className="w-10 h-10 rounded-full" />
                              <span className="font-bold text-sm">{selectedItem.userName}</span>
                           </div>
                           <p className="text-xs text-gray-500">ID: {selectedItem.userId}</p>
                        </div>

                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                           <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Extracted Data</h4>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><span className="text-gray-500 block text-xs">Raasi</span><span className="font-bold">{selectedItem.raasi}</span></div>
                              <div><span className="text-gray-500 block text-xs">Nakshatra</span><span className="font-bold">{selectedItem.nakshatra}</span></div>
                              <div><span className="text-gray-500 block text-xs">Lagnam</span><span className="font-bold">{selectedItem.lagnam}</span></div>
                              <div><span className="text-gray-500 block text-xs">Dosham</span><span className="font-bold text-red-500">{selectedItem.dosham}</span></div>
                           </div>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold uppercase text-purple-700 dark:text-purple-300">AI Confidence</span>
                              <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{selectedItem.aiMatchScore}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-purple-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600" style={{ width: `${selectedItem.aiMatchScore}%` }} />
                           </div>
                           <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                              {selectedItem.aiMatchScore > 80 ? "Data matches user profile inputs." : "Discrepancy detected with user profile."}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Right: Preview & Actions */}
                  <div className="flex-1 flex flex-col bg-gray-100 dark:bg-black/40">
                     <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center">
                           <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                           <h4 className="text-lg font-bold text-gray-600 dark:text-gray-300">Horoscope PDF Preview</h4>
                           <p className="text-sm text-gray-500 mb-6">FileName: {selectedItem.fileUrl}</p>
                           <PremiumButton variant="outline" icon={<Download size={16} />}>Download Original</PremiumButton>
                        </div>
                     </div>
                     
                     <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 flex gap-4">
                        <button 
                           onClick={() => handleAction('Rejected')}
                           className="flex-1 py-3 border border-red-200 dark:border-red-900/30 text-red-600 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                           <XCircle size={18} /> Reject
                        </button>
                        <button 
                           onClick={() => handleAction('Request Re-upload')}
                           className="flex-1 py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                           <RotateCcw size={18} /> Re-upload
                        </button>
                        <PremiumButton onClick={() => handleAction('Approved')} className="flex-[2] flex items-center justify-center gap-2">
                           <CheckCircle size={18} /> Approve
                        </PremiumButton>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHoroscope;
