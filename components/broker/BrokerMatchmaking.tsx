
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Heart, Star, Share2, FileText, ChevronRight, 
  Sparkles, Check, X, ArrowLeftRight, UserPlus, Phone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import { AnimatedSelect } from '../profile/ProfileFormElements';
import { MatchCard } from '../dashboard/DashboardWidgets';
import { generateMockProfiles, Profile, MOCK_CLIENTS } from '../../utils/mockData';

const BrokerMatchmaking: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState(MOCK_CLIENTS[0].name);
  const [matches, setMatches] = useState<Profile[]>(generateMockProfiles(12).map(p => ({...p, matchScore: Math.floor(Math.random() * (99-70)+70)})));
  const [compareList, setCompareList] = useState<Profile[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
  const toggleCompare = (profile: Profile) => {
    if (compareList.find(p => p.id === profile.id)) {
      setCompareList(prev => prev.filter(p => p.id !== profile.id));
    } else {
      if (compareList.length < 3) setCompareList(prev => [...prev, profile]);
      else alert("You can compare max 3 profiles.");
    }
  };

  const handleShortlist = (profile: Profile) => {
    alert(`Shortlisted ${profile.name} for ${selectedClient}`);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2 min-w-[200px]">
               <span className="text-xs font-bold text-gray-500 uppercase">Matching For:</span>
               <select 
                  value={selectedClient} 
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-transparent font-bold text-sm outline-none text-purple-600 dark:text-purple-400"
               >
                  {MOCK_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
            </div>
            
            <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`p-2 rounded-xl border transition-colors flex items-center gap-2 text-sm font-bold ${showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-200 text-gray-600'}`}
            >
               <Filter size={16} /> Filters
            </button>
         </div>

         {compareList.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-purple-900 text-white px-4 py-2 rounded-xl shadow-lg">
               <span className="text-sm font-bold">{compareList.length} Selected</span>
               <button onClick={() => setShowCompare(true)} className="px-3 py-1 bg-white text-purple-900 rounded-lg text-xs font-bold hover:bg-gray-100">Compare Now</button>
               <button onClick={() => setCompareList([])} className="p-1 hover:bg-white/20 rounded"><X size={14} /></button>
            </motion.div>
         )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
         {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <AnimatedSelect label="Religion" options={[{value:'hindu',label:'Hindu'}, {value:'christian',label:'Christian'}]} value="" onChange={() => {}} />
                  <AnimatedSelect label="Caste" options={[{value:'iyer',label:'Iyer'}, {value:'iyengar',label:'Iyengar'}]} value="" onChange={() => {}} />
                  <AnimatedSelect label="Education" options={[{value:'masters',label:'Masters'}, {value:'bachelors',label:'Bachelors'}]} value="" onChange={() => {}} />
                  <AnimatedSelect label="Location" options={[{value:'chennai',label:'Chennai'}, {value:'usa',label:'USA'}]} value="" onChange={() => {}} />
               </div>
               <div className="flex justify-end mt-4">
                  <PremiumButton className="!py-2 !px-6 !text-sm">Apply Smart Filter</PremiumButton>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Match Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matches.map((profile, idx) => (
               <div key={profile.id} className="relative group">
                  <MatchCard 
                     match={{...profile, job: profile.occupation, image: profile.img}} 
                     delay={idx * 0.05}
                  />
                  {/* Broker Action Overlay */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                     <div className="flex gap-1">
                        <button 
                           onClick={(e) => { e.stopPropagation(); toggleCompare(profile); }}
                           className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-colors ${compareList.find(p => p.id === profile.id) ? 'bg-purple-600 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
                           title="Compare"
                        >
                           <ArrowLeftRight size={14} />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full backdrop-blur-md text-gray-600 hover:text-blue-600 hover:bg-white transition-colors" title="Download PDF">
                           <FileText size={14} />
                        </button>
                     </div>
                     <button onClick={() => handleShortlist(profile)} className="p-2 bg-white/80 rounded-full backdrop-blur-md text-gray-600 hover:text-amber-500 hover:bg-white transition-colors">
                        <Star size={14} />
                     </button>
                  </div>
                  <div className="absolute bottom-[70px] left-0 right-0 p-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                        <UserPlus size={14} /> Send Interest for {selectedClient.split(' ')[0]}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* COMPARISON MODAL */}
      <AnimatePresence>
         {showCompare && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCompare(false)} />
               <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-6xl h-[80vh] bg-white dark:bg-[#121212] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
                     <h3 className="text-xl font-bold">Side-by-Side Comparison</h3>
                     <button onClick={() => setShowCompare(false)}><X size={24} className="text-gray-500 hover:text-white" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-auto custom-scrollbar p-6">
                     <div className="grid grid-cols-4 gap-4 min-w-[800px]">
                        {/* Labels Column */}
                        <div className="space-y-4 pt-48">
                           {['Match Score', 'Age / Height', 'Religion & Caste', 'Education', 'Profession', 'Income', 'Location', 'Horoscope', 'Family Type'].map(label => (
                              <div key={label} className="h-10 flex items-center text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</div>
                           ))}
                        </div>

                        {/* Profiles */}
                        {compareList.map(p => (
                           <div key={p.id} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                              <div className="text-center mb-6">
                                 <img src={p.img} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-white dark:border-white/10" />
                                 <h4 className="font-bold text-lg">{p.name}</h4>
                                 <p className="text-xs text-gray-500">{p.id}</p>
                              </div>
                              <div className="space-y-4 text-center">
                                 <div className="h-10 flex items-center justify-center text-xl font-bold text-green-500">{p.matchScore}%</div>
                                 <div className="h-10 flex items-center justify-center text-sm">{p.age} Yrs / {p.height}</div>
                                 <div className="h-10 flex items-center justify-center text-sm font-bold">{p.religion}, {p.caste}</div>
                                 <div className="h-10 flex items-center justify-center text-sm">{p.education}</div>
                                 <div className="h-10 flex items-center justify-center text-sm">{p.occupation}</div>
                                 <div className="h-10 flex items-center justify-center text-sm font-mono">{p.income}</div>
                                 <div className="h-10 flex items-center justify-center text-sm">{p.location}</div>
                                 <div className="h-10 flex items-center justify-center text-sm text-purple-500 font-bold">{p.raasi} / {p.nakshatra}</div>
                                 <div className="h-10 flex items-center justify-center text-sm">{p.familyType}</div>
                              </div>
                              <div className="mt-6">
                                 <PremiumButton width="full" className="!py-2 !text-xs">Select This Match</PremiumButton>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default BrokerMatchmaking;
