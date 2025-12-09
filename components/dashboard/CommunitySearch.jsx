
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Sun, Moon, Star, Filter, Search, ChevronRight, X, ArrowLeft,
  CheckCircle, Loader2, RefreshCw
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import { MatchCard } from './DashboardWidgets';
import { generateMockProfiles } from '../../utils/mockData';


// --- THEME DEFINITIONS ---
const THEMES = {
  Hindu: {
    gradient: "from-orange-500 to-red-600",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(220, 38, 38, 0.1) 0%, transparent 30%)",
    accent: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    textAccent: "text-orange-600 dark:text-orange-400",
    icon: <Sun className="w-6 h-6" />,
    font: "font-serif",
    borderColor: "border-orange-200 dark:border-orange-800",
    cardBg: "bg-orange-50/50 dark:bg-black/40",
  },
  Christian: {
    gradient: "from-blue-400 to-indigo-500",
    bgPattern: "radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.1) 0%, transparent 40%), linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(165, 180, 252, 0.05) 100%)",
    accent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    textAccent: "text-blue-600 dark:text-blue-400",
    icon: <Star className="w-6 h-6" />,
    font: "font-sans",
    borderColor: "border-blue-200 dark:border-blue-800",
    cardBg: "bg-blue-50/50 dark:bg-black/40",
  },
  Muslim: {
    gradient: "from-emerald-500 to-teal-600",
    bgPattern: "repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0px, rgba(16, 185, 129, 0.03) 10px, transparent 10px, transparent 20px)",
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    icon: <Moon className="w-6 h-6" />,
    font: "font-sans",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    cardBg: "bg-emerald-50/50 dark:bg-black/40",
  },
  General: {
    gradient: "from-purple-500 to-pink-600",
    bgPattern: "",
    accent: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    textAccent: "text-purple-600 dark:text-purple-400",
    icon: <Globe className="w-6 h-6" />,
    font: "font-display",
    borderColor: "border-purple-200 dark:border-purple-800",
    cardBg: "bg-white/60 dark:bg-black/20",
  }
};

// --- DATA ---
const COMMUNITIES = [
  { id: 'Hindu', castes: ['Iyer', 'Iyengar', 'Mudaliar', 'Nadar', 'Chettiar', 'Vanniyar', 'Gounder', 'Pillai', 'Thevar'] },
  { id: 'Christian', castes: ['Catholic', 'CSI', 'General'] },
  { id: 'Muslim', castes: ['Sunni', 'Shia', 'General'] },
];

const CommunitySearch = () => {
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedCaste, setSelectedCaste] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [ageRange, setAgeRange] = useState([21, 35]);
  const [showAgeFilter, setShowAgeFilter] = useState(false);

  // Load profiles when selection changes
  useEffect(() => {
    if (selectedReligion) {
      setLoading(true);
      setTimeout(() => {
        let mock = generateMockProfiles(30);
        // Filter Logic
        mock = mock.filter(p => {
           let match = true;
           // Religion
           if (selectedReligion && selectedReligion !== 'General') {
              match = p.religion.toLowerCase() === selectedReligion.toLowerCase();
           }
           // Caste
           if (match && selectedCaste && selectedCaste !== 'General') {
              match = p.caste.includes(selectedCaste);
           }
           // Age Range
           if (match) {
              match = p.age >= ageRange[0] && p.age <= ageRange[1];
           }
           return match;
        });
        
        // Add random score for demo
        mock = mock.map(p => ({...p, matchScore: Math.floor(Math.random() * (99 - 70) + 70)}));
        
        setProfiles(mock);
        setLoading(false);
      }, 1500);
    }
  }, [selectedReligion, selectedCaste, ageRange]); // Re-run when age range changes

  // Handle Reset
  const resetSelection = () => {
    setSelectedReligion(null);
    setSelectedCaste(null);
    setAgeRange([21, 35]);
    setProfiles([]);
  };

  const currentTheme = selectedReligion ? THEMES[selectedReligion] : THEMES['General'];

  return (
    <div className={`relative min-h-[80vh] transition-all duration-700 ${selectedReligion ? currentTheme.font : ''}`}>
      
      {/* Dynamic Background Pattern */}
      {selectedReligion && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: currentTheme.bgPattern }}
        />
      )}

      {/* VIEW 1: SELECTION GRID */}
      {!selectedReligion && (
        <div className="space-y-12 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
              Discover by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Community</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Explore profiles tailored to your specific cultural, religious, and community preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {COMMUNITIES.map((comm) => {
              const theme = THEMES[comm.id];
              return (
                <motion.div
                  key={comm.id}
                  whileHover={{ y: -10 }}
                  className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer"
                  onClick={() => setSelectedReligion(comm.id)}
                >
                  {/* Card Header with Pattern */}
                  <div className={`h-32 bg-gradient-to-r ${theme.gradient} relative overflow-hidden flex items-center justify-center`}>
                     <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-white/30 group-hover:scale-110 transition-transform duration-500">
                        {theme.icon}
                     </div>
                  </div>
                  
                  <div className="p-8">
                     <h3 className="text-2xl font-bold text-center mb-6">{comm.id} Matrimony</h3>
                     
                     <div className="flex flex-wrap gap-2 justify-center">
                        {comm.castes.slice(0, 6).map(caste => (
                           <span key={caste} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5 group-hover:border-transparent group-hover:bg-purple-50 dark:group-hover:bg-white/10 transition-colors">
                              {caste}
                           </span>
                        ))}
                        {comm.castes.length > 6 && (
                           <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-xs font-bold text-gray-400">
                              +{comm.castes.length - 6} more
                           </span>
                        )}
                     </div>

                     <div className="mt-8 flex justify-center">
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-purple-600 transition-colors">
                           Browse Profiles <ChevronRight size={16} />
                        </span>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: THEMED SEARCH PAGE */}
      {selectedReligion && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
           {/* Themed Header */}
           <div className={`
              rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl
              bg-gradient-to-r ${currentTheme.gradient} text-white
           `}>
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <button 
                 onClick={resetSelection}
                 className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
              >
                 <ArrowLeft size={20} />
              </button>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                 <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }}
                   className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/30 shadow-xl"
                 >
                    {currentTheme.icon}
                 </motion.div>
                 <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-bold mb-2">{selectedReligion} Matrimony</h2>
                    <p className="text-white/80 text-lg max-w-xl">
                       Browse exclusive profiles from the {selectedReligion} community. 
                       Filter by caste, location, and more.
                    </p>
                 </div>
              </div>
           </div>

           {/* Filter Bar */}
           <div className={`p-4 rounded-2xl border ${currentTheme.borderColor} ${currentTheme.cardBg} backdrop-blur-xl shadow-lg flex flex-col md:flex-row gap-4 items-center`}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 w-full md:w-auto min-w-[200px]">
                 <Filter size={18} className="text-gray-500" />
                 <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Community:</span>
                 <select 
                    value={selectedCaste || ''} 
                    onChange={(e) => setSelectedCaste(e.target.value)}
                    className="bg-transparent outline-none font-bold text-gray-900 dark:text-white cursor-pointer w-full"
                 >
                    <option value="">All Castes</option>
                    {COMMUNITIES.find(c => c.id === selectedReligion)?.castes.map(c => (
                       <option key={c} value={c}>{c}</option>
                    ))}
                 </select>
              </div>

              {/* Age Filter Dropdown */}
              <div className="relative w-full md:w-auto">
                 <button 
                    onClick={() => setShowAgeFilter(!showAgeFilter)}
                    className="w-full md:w-auto flex items-center justify-between gap-3 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                 >
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Age:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{ageRange[0]} - {ageRange[1]} Yrs</span>
                    <ChevronRight size={16} className={`text-gray-400 transition-transform ${showAgeFilter ? 'rotate-90' : ''}`} />
                 </button>
                 
                 {/* Popup for Slider */}
                 <AnimatePresence>
                    {showAgeFilter && (
                       <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowAgeFilter(false)} />
                          <motion.div 
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                             className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl z-40"
                          >
                             <div className="mb-4 text-xs font-bold text-center text-gray-500 uppercase">Select Age Range</div>
                             <GradientRangeSlider 
                                min={18} max={60} 
                                value={ageRange} 
                                onChange={setAgeRange} 
                             />
                          </motion.div>
                       </>
                    )}
                 </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 flex-1 w-full">
                 <Search size={18} className="text-gray-500" />
                 <input 
                    type="text" 
                    placeholder="Search by City, Education or Name..." 
                    className="bg-transparent outline-none w-full text-sm font-medium"
                 />
              </div>

              <button 
                 onClick={() => { setSelectedCaste(null); setAgeRange([21, 35]); }}
                 className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-500 transition-colors"
                 title="Reset Filters"
              >
                 <RefreshCw size={18} />
              </button>
           </div>

           {/* Results Grid */}
           <div className="relative min-h-[400px]">
              {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Loader2 size={40} className={`animate-spin ${currentTheme.textAccent} mb-4`} />
                    <p className="text-gray-500">Finding matches in {selectedReligion} community...</p>
                 </div>
              ) : profiles.length > 0 ? (
                 <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                    {profiles.map((profile, idx) => (
                       <MatchCard 
                          key={profile.id}
                          match={{
                             name: profile.name,
                             age: profile.age,
                             height: profile.height,
                             job: profile.occupation,
                             location: profile.location,
                             image: profile.img,
                             matchScore: profile.matchScore
                          }}
                          delay={idx * 0.05}
                       />
                    ))}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/10">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-6">
                       <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Profiles Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
                       Try adjusting the caste filter or clearing search terms to see more results.
                    </p>
                    <button onClick={() => setSelectedCaste(null)} className={`mt-6 ${currentTheme.textAccent} font-bold hover:underline`}>
                       View All {selectedReligion} Profiles
                    </button>
                 </div>
              )}
           </div>

        </motion.div>
      )}

    </div>
  );
};

export default CommunitySearch;
