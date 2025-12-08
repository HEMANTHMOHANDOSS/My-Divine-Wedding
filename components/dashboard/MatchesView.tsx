
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search, Heart, MessageCircle, Star, Sliders, MapPin, Briefcase, CheckCircle, BookOpen, AlertCircle, Info } from 'lucide-react';
import { AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { generateMockProfiles, Profile } from '../../utils/mockData';
import { calculateCompatibility, getFallbackMatches, UserPreferences, MatchResult } from '../../utils/matchingAlgorithm';
import ProfileDetailModal from './ProfileDetailModal';
import PremiumButton from '../ui/PremiumButton';
import { MatchCard } from './DashboardWidgets';

interface MatchesViewProps {
  onConnect?: (profile: Profile) => void;
  onInterest?: (profile: Profile) => void;
  onShortlist?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
}

const MatchesView: React.FC<MatchesViewProps> = ({ onConnect, onInterest, onShortlist, onViewProfile }) => {
  const [profiles, setProfiles] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  
  // Mock User Profile for Matching Context
  const currentUserProfile = {
    id: 'ME',
    nakshatra: 'rohin',
    age: 26,
    heightCm: 175
  };

  // Filter States
  const [filters, setFilters] = useState({
    ageMin: '21',
    ageMax: '30',
    heightMin: '150',
    heightMax: '180',
    religion: '',
    caste: '',
    education: '', location: ''
  });

  // Run Algorithm when filters change
  useEffect(() => {
    setLoading(true);
    setIsFallbackMode(false);

    // Simulate Network Delay for realism
    const timer = setTimeout(() => {
       const rawCandidates = generateMockProfiles(20); // Fetch pool
       
       const preferences: UserPreferences = {
         ageRange: [Number(filters.ageMin), Number(filters.ageMax)],
         heightRange: [Number(filters.heightMin), Number(filters.heightMax)],
         maritalStatus: [],
         religion: filters.religion ? [filters.religion] : [],
         caste: filters.caste ? [filters.caste] : [],
         education: filters.education ? [filters.education] : [],
         occupationType: [],
         minIncome: 0,
         diet: [],
         location: filters.location ? [filters.location] : [],
         smoking: 'no',
         drinking: 'no',
         starPreference: []
       };

       let matchedResults = calculateCompatibility(currentUserProfile, preferences, rawCandidates);
       let filteredResults = matchedResults.filter(r => r.score > 60);

       if (filteredResults.length === 0) {
          setIsFallbackMode(true);
          filteredResults = getFallbackMatches(currentUserProfile, preferences, rawCandidates).slice(0, 6);
       }

       setProfiles(filteredResults);
       setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
      setFilters({ ageMin: '21', ageMax: '30', heightMin: '150', heightMax: '180', religion: '', caste: '', education: '', location: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 relative">
       {/* FILTER SIDEBAR OVERLAY (Mobile) */}
       <AnimatePresence>
         {showFilters && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
               onClick={() => setShowFilters(false)}
            />
         )}
       </AnimatePresence>

       {/* FILTER SIDEBAR (Responsive) */}
       <AnimatePresence>
         {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
               initial={{ x: -320, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -320, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className={`
                  fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-80 
                  bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl 
                  lg:bg-white/40 lg:dark:bg-white/5 
                  border-r lg:border lg:border-white/20 lg:dark:border-white/10
                  p-6 overflow-y-auto custom-scrollbar h-full lg:h-auto lg:rounded-2xl lg:shadow-none shadow-2xl
                  ${!showFilters ? 'hidden lg:block' : 'block'}
               `}
            >
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Filter size={20} className="text-purple-600" /> Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                     <X size={20} />
                  </button>
               </div>

               <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-3 block">Age Range</label>
                     <div className="flex gap-2">
                        <input 
                           type="number" className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-center" 
                           value={filters.ageMin} onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                        />
                        <span className="self-center text-gray-400">-</span>
                        <input 
                           type="number" className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-center" 
                           value={filters.ageMax} onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Height Range (cm) */}
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-3 block">Height (cm)</label>
                     <div className="flex gap-2">
                        <input 
                           type="number" className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-center" 
                           value={filters.heightMin} onChange={(e) => handleFilterChange('heightMin', e.target.value)}
                        />
                        <span className="self-center text-gray-400">-</span>
                        <input 
                           type="number" className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-center" 
                           value={filters.heightMax} onChange={(e) => handleFilterChange('heightMax', e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Religion & Caste */}
                  <AnimatedSelect 
                     label="Religion" 
                     value={filters.religion} 
                     onChange={(e) => handleFilterChange('religion', e.target.value)}
                     options={[{value:'hindu', label:'Hindu'}, {value:'christian', label:'Christian'}, {value:'muslim', label:'Muslim'}]}
                     className="!mb-0"
                  />
                  
                  <AnimatedInput 
                     label="Caste" 
                     value={filters.caste} 
                     onChange={(e) => handleFilterChange('caste', e.target.value)}
                     className="!mb-0"
                  />

                  {/* Education */}
                  <AnimatedSelect 
                     label="Education" 
                     value={filters.education} 
                     onChange={(e) => handleFilterChange('education', e.target.value)}
                     options={[{value:'B.Tech', label:'B.Tech'}, {value:'MBA', label:'MBA'}, {value:'MBBS', label:'MBBS'}]}
                     className="!mb-0"
                  />

                   <AnimatedInput 
                     label="Location" 
                     value={filters.location} 
                     onChange={(e) => handleFilterChange('location', e.target.value)}
                     className="!mb-0"
                  />

                  <div className="pt-4 flex gap-2">
                     <button onClick={clearFilters} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Clear</button>
                     <PremiumButton onClick={() => setShowFilters(false)} className="!py-2 !px-6 !text-sm flex-1">Apply</PremiumButton>
                  </div>
               </div>
            </motion.aside>
         )}
       </AnimatePresence>
       
       {/* MAIN CONTENT */}
       <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6 px-2">
             <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <h2 className="text-xl md:text-2xl font-display font-bold">Recommended Matches</h2>
                   <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs font-bold">{profiles.length}</span>
                </div>
                {isFallbackMode && (
                   <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> Showing flexible matches as exact preferences yielded no results.
                   </p>
                )}
             </div>
             <button 
               onClick={() => setShowFilters(true)}
               className="lg:hidden p-2 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-200 dark:border-white/10"
             >
                <Sliders size={20} />
             </button>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-6">
                {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="h-[400px] bg-white/20 dark:bg-white/5 rounded-[2rem] animate-pulse" />
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 md:gap-6 pb-10">
                {profiles.map((result, idx) => (
                   <MatchCard 
                     key={result.profile.id} 
                     match={{...result.profile, job: result.profile.occupation, image: result.profile.img}}
                     delay={idx * 0.05}
                     onConnect={() => onConnect && onConnect(result.profile)}
                     onInterest={() => onInterest && onInterest(result.profile)}
                     onShortlist={() => onShortlist && onShortlist(result.profile)}
                     onViewProfile={() => onViewProfile && onViewProfile(result.profile)}
                   />
                ))}
             </div>
          )}
       </div>

       {/* DETAIL MODAL */}
       <AnimatePresence>
          {selectedProfile && (
             <ProfileDetailModal 
                profile={selectedProfile} 
                onClose={() => setSelectedProfile(null)}
                onConnect={onConnect}
                onInterest={onInterest}
                onShortlist={onShortlist}
             />
          )}
       </AnimatePresence>
    </div>
  );
};

export default MatchesView;
