
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, AlertCircle, X, ChevronDown, Check, Briefcase, MapPin } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import { AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { generateMockProfiles, Profile } from '../../utils/mockData';
import { MatchCard } from './DashboardWidgets';

const BasicSearch: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const [searched, setSearched] = useState(false);

  // Search Parameters
  const [filters, setFilters] = useState({
    ageRange: [21, 35] as [number, number],
    heightRange: [150, 180] as [number, number],
    maritalStatus: '',
    religion: '',
    caste: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);
    
    // Simulate API Call with filtering mock data
    setTimeout(() => {
      const mockData = generateMockProfiles(20);
      const filtered = mockData.filter(profile => {
        const ageMatch = profile.age >= filters.ageRange[0] && profile.age <= filters.ageRange[1];
        const heightMatch = profile.heightCm >= filters.heightRange[0] && profile.heightCm <= filters.heightRange[1];
        
        let religionMatch = true;
        if (filters.religion) religionMatch = profile.religion.toLowerCase() === filters.religion.toLowerCase();
        
        let casteMatch = true;
        if (filters.caste) casteMatch = profile.caste.toLowerCase().includes(filters.caste.toLowerCase());
        
        let locationMatch = true;
        if (filters.location) locationMatch = profile.location.toLowerCase().includes(filters.location.toLowerCase());

        let maritalMatch = true;
        if (filters.maritalStatus) maritalMatch = profile.maritalStatus === filters.maritalStatus;

        return ageMatch && heightMatch && religionMatch && casteMatch && locationMatch && maritalMatch;
      });
      
      // Inject some compatibility scores for UI
      const resultsWithScores = filtered.map(p => ({
         ...p,
         matchScore: Math.floor(Math.random() * (95 - 60) + 60)
      }));

      setResults(resultsWithScores);
      setLoading(false);
    }, 1500);
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [21, 35],
      heightRange: [150, 180],
      maritalStatus: '', religion: '', caste: '', location: '',
    });
    setSearched(false);
    setResults([]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Search className="text-purple-600 dark:text-gold-400" />
            Basic Search
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Find your partner by setting specific preferences.
          </p>
        </div>
        {searched && (
           <button 
             onClick={resetFilters}
             className="text-sm font-bold text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-colors"
           >
             <RefreshCw size={14} /> Reset Filters
           </button>
        )}
      </div>

      {/* Search Form Card */}
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Age Range Slider */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Age Range</label>
                  <span className="text-xs font-bold text-purple-600 dark:text-gold-400 bg-purple-50 dark:bg-white/5 px-2 py-1 rounded">
                     {filters.ageRange[0]} - {filters.ageRange[1]} Yrs
                  </span>
               </div>
               <div className="px-1">
                  <GradientRangeSlider 
                     min={18} max={70} 
                     value={filters.ageRange} 
                     onChange={(val) => setFilters(prev => ({...prev, ageRange: val}))} 
                  />
               </div>
            </div>

            {/* Height Range Slider */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Height (cm)</label>
                  <span className="text-xs font-bold text-purple-600 dark:text-gold-400 bg-purple-50 dark:bg-white/5 px-2 py-1 rounded">
                     {filters.heightRange[0]} - {filters.heightRange[1]} cm
                  </span>
               </div>
               <div className="px-1">
                  <GradientRangeSlider 
                     min={140} max={220} 
                     value={filters.heightRange} 
                     onChange={(val) => setFilters(prev => ({...prev, heightRange: val}))} 
                  />
               </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Marital Status</label>
               <div className="relative">
                  <select 
                     value={filters.maritalStatus}
                     onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                  >
                     <option value="">Any</option>
                     <option value="never_married">Never Married</option>
                     <option value="divorced">Divorced</option>
                     <option value="widowed">Widowed</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               </div>
            </div>

            {/* Religion */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Religion</label>
               <div className="relative">
                  <select 
                     value={filters.religion}
                     onChange={(e) => handleInputChange('religion', e.target.value)}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                  >
                     <option value="">Any</option>
                     <option value="hindu">Hindu</option>
                     <option value="christian">Christian</option>
                     <option value="muslim">Muslim</option>
                     <option value="jain">Jain</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               </div>
            </div>

            {/* Caste */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Caste</label>
               <input 
                  type="text" 
                  placeholder="E.g. Iyer, Nadar..."
                  value={filters.caste}
                  onChange={(e) => handleInputChange('caste', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-purple-500/50"
               />
            </div>

            {/* Location */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Location</label>
               <input 
                  type="text" 
                  placeholder="City, State or Country"
                  value={filters.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-purple-500/50"
               />
            </div>

            <div className="md:col-span-2 lg:col-span-2 flex items-end">
               <PremiumButton 
                  onClick={handleSearch} 
                  width="full" 
                  variant="gradient"
                  disabled={loading}
                  icon={loading ? <RefreshCw className="animate-spin" /> : <Search />}
               >
                  {loading ? 'Searching Profiles...' : 'Search Now'}
               </PremiumButton>
            </div>
         </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
         {searched && (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="space-y-6"
            >
               <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Search Results</h3>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                     {results.length} Profiles Found
                  </span>
               </div>

               {loading ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                     {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] animate-pulse" />
                     ))}
                  </div>
               ) : results.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                     {results.map((profile, idx) => (
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
                  <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-300 dark:border-white/10">
                     <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <Search size={32} />
                     </div>
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white">No Profiles Found</h4>
                     <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Try adjusting your filters to see more results.</p>
                     <button onClick={resetFilters} className="mt-6 text-purple-600 font-bold text-sm hover:underline">Clear all filters</button>
                  </div>
               )}
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default BasicSearch;
