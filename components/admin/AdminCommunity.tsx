
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Sun, Moon, Star, Plus, Edit2, Trash2, ChevronRight, 
  ChevronDown, Layout, CheckCircle, Smartphone
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { MOCK_COMMUNITY_STRUCTURE, CommunityStructure } from '../../utils/adminData';

const AdminCommunity: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityStructure[]>(MOCK_COMMUNITY_STRUCTURE);
  const [expandedId, setExpandedId] = useState<string | null>('hindu');
  const [selectedCaste, setSelectedCaste] = useState<any | null>(null);
  
  // Theme Preview State
  const [activePreview, setActivePreview] = useState<CommunityStructure>(communities[0]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    const comm = communities.find(c => c.id === id);
    if (comm) setActivePreview(comm);
  };

  const handleDelete = (id: string, type: 'religion' | 'caste') => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
       // Mock deletion
       alert("Deleted successfully");
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      
      {/* LEFT: Manager Tree */}
      <div className="w-full md:w-1/2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
         <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-bold flex items-center gap-2"><Globe className="text-cyan-500" /> Community Manager</h3>
               <p className="text-xs text-gray-500">Manage structure & themes</p>
            </div>
            <button className="p-2 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors">
               <Plus size={20} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {communities.map((comm) => (
               <div key={comm.id} className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                  <div 
                     onClick={() => toggleExpand(comm.id)}
                     className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${expandedId === comm.id ? 'bg-gray-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${comm.theme === 'orange' ? 'bg-orange-100 text-orange-600' : comm.theme === 'green' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                           {comm.id === 'hindu' ? <Sun size={18} /> : comm.id === 'muslim' ? <Moon size={18} /> : <Star size={18} />}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white capitalize">{comm.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-white dark:bg-black/20 px-2 py-1 rounded border border-gray-200 dark:border-white/10 text-gray-500">{comm.castes.length} Castes</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedId === comm.id ? 'rotate-180' : ''}`} />
                     </div>
                  </div>

                  <AnimatePresence>
                     {expandedId === comm.id && (
                        <motion.div 
                           initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                           className="bg-gray-50/50 dark:bg-black/20 overflow-hidden"
                        >
                           <div className="p-3 space-y-2">
                              {comm.castes.map((caste) => (
                                 <div 
                                    key={caste.id} 
                                    onClick={() => setSelectedCaste(caste)}
                                    className={`flex justify-between items-center p-3 rounded-xl ml-4 border hover:border-purple-300 cursor-pointer transition-all ${selectedCaste?.id === caste.id ? 'bg-white dark:bg-white/10 border-purple-500 shadow-sm' : 'border-transparent hover:bg-white dark:hover:bg-white/5'}`}
                                 >
                                    <div>
                                       <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{caste.name}</div>
                                       <div className="text-[10px] text-gray-500">{caste.subCastes.length} Sub-castes • {caste.profileCount} Profiles</div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><Edit2 size={14} /></button>
                                       <button className="p-1.5 hover:bg-red-100 text-red-500 rounded"><Trash2 size={14} /></button>
                                    </div>
                                 </div>
                              ))}
                              <button className="w-full ml-4 p-3 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl text-xs font-bold text-gray-400 flex items-center justify-center gap-2 hover:border-purple-400 hover:text-purple-600 transition-colors">
                                 <Plus size={14} /> Add New Caste
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            ))}
         </div>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="w-full md:w-1/2 flex flex-col">
         <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
               <h3 className="text-xl font-bold flex items-center gap-2"><Layout className="text-purple-500" /> Live Preview</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1"><Smartphone size={12} /> Mobile View</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               </div>
            </div>

            <div className="flex-1 p-8 bg-gray-100 dark:bg-black/50 flex items-center justify-center relative overflow-hidden">
               {/* Background Grid */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

               {/* Simulated Phone Screen */}
               <div className="w-[320px] h-[550px] bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border-8 border-gray-900 relative overflow-hidden flex flex-col">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />
                  
                  {/* Content inside phone */}
                  <div className="flex-1 overflow-y-auto hide-scrollbar relative">
                     {/* Dynamic Theme Background */}
                     <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${
                        activePreview.theme === 'orange' ? 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/10' :
                        activePreview.theme === 'green' ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10' :
                        'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10'
                     }`} />
                     
                     <div className={`h-40 relative flex items-center justify-center text-white bg-gradient-to-r ${
                        activePreview.theme === 'orange' ? 'from-orange-500 to-red-600' :
                        activePreview.theme === 'green' ? 'from-emerald-500 to-teal-600' :
                        'from-blue-400 to-indigo-500'
                     }`}>
                        <div className="text-center pt-6">
                           <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg border border-white/30">
                              {activePreview.id === 'hindu' ? <Sun size={20} /> : activePreview.id === 'muslim' ? <Moon size={20} /> : <Star size={20} />}
                           </div>
                           <h2 className="text-xl font-bold">{activePreview.name}</h2>
                           <p className="text-[10px] opacity-80">Matrimony</p>
                        </div>
                     </div>

                     <div className="p-4 -mt-6">
                        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                           <h4 className="font-bold text-sm mb-3">Browse Castes</h4>
                           <div className="grid grid-cols-2 gap-2">
                              {activePreview.castes.slice(0, 4).map(c => (
                                 <div key={c.id} className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-center border border-gray-100 dark:border-white/5">
                                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{c.name}</div>
                                    <div className="text-[8px] text-gray-400">{c.profileCount}</div>
                                 </div>
                              ))}
                           </div>
                           <div className="mt-4 text-center">
                              <span className={`text-xs font-bold ${
                                 activePreview.theme === 'orange' ? 'text-orange-600' :
                                 activePreview.theme === 'green' ? 'text-emerald-600' : 'text-blue-600'
                              }`}>View All</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
               <div className="text-xs text-gray-500">
                  Previewing: <span className="font-bold text-gray-900 dark:text-white capitalize">{activePreview.name} Theme</span>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-white dark:hover:bg-white/5 transition-colors">Edit Theme</button>
                  <PremiumButton className="!py-2 !px-4 !text-xs !rounded-xl">Save Changes</PremiumButton>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AdminCommunity;
