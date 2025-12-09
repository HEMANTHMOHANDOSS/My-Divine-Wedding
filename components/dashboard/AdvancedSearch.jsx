
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, RefreshCw, X, ChevronDown, Check, 
  Briefcase, BookOpen, Coffee, Moon, Globe, DollarSign, Filter,
  CheckCircle, Plus, Sparkles, MapPin, Smile, Navigation, Target, LocateFixed, Map
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import { AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';
import { generateMockProfiles } from '../../utils/mockData';
import { MatchCard } from './DashboardWidgets';

const INITIAL_FILTERS = {
  ageRange: [21, 30],
  heightRange: [150, 180],
  education: [],
  profession: [],
  jobType: [],
  salaryRange: [5, 50],
  diet: [],
  smoking: 'any',
  drinking: 'any',
  complexion: [],
  religion: '',
  caste: '',
  subCaste: '',
  gothram: '',
  raasi: [],
  nakshatra: [],
  dosham: 'any',
  matchHoroscope: false,
  languages: [],
  locationMode: 'manual',
  manualLocation: '',
  gpsRadius: 50,
  gpsCoordinates: null,
  detectedAddress: '',
};

// --- COMPONENTS ---

// 1. Multi-Select Chip Input
const MultiSelectChips = ({ label, options, selected, onChange, placeholder = "Search..." }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(input.toLowerCase()) && !selected.includes(opt)
  );

  const addOption = (opt) => {
    onChange([...selected, opt]);
    setInput('');
    setShowSuggestions(false);
  };

  const removeOption = (opt) => {
    onChange(selected.filter(s => s !== opt));
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/50 transition-all min-h-[50px]">
        {selected.map(item => (
          <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold animate-in fade-in zoom-in duration-200">
            {item}
            <button onClick={() => removeOption(item)} className="hover:text-purple-900 dark:hover:text-white"><X size={12} /></button>
          </span>
        ))}
        <input 
          type="text" 
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="bg-transparent outline-none flex-1 min-w-[100px] text-sm text-gray-900 dark:text-white placeholder-gray-400 h-8"
        />
      </div>
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && input && filteredOptions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar"
          >
            {filteredOptions.map(opt => (
              <button 
                key={opt} 
                onClick={() => addOption(opt)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay to close suggestions */}
      {showSuggestions && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  );
};

// 3. Section Wrapper
const FilterSection = ({ title, icon, children, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] p-6 shadow-xl space-y-6 h-full"
  >
    <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

// 4. Proximity Search Module
const ProximitySearch = ({ mode, manualValue, radius, detectedAddress, onModeChange, onManualChange, onRadiusChange, onDetectLocation, isDetecting }) => {
  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
        <button
          onClick={() => onModeChange('manual')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'manual' ? 'bg-white dark:bg-gray-800 shadow text-purple-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => onModeChange('gps')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${mode === 'gps' ? 'bg-white dark:bg-gray-800 shadow text-purple-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Navigation size={12} /> GPS Nearby
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'manual' ? (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Search City, State or Country"
                 value={manualValue}
                 onChange={(e) => onManualChange(e.target.value)}
                 className="w-full bg-white/60 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="gps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            
            {/* Detect Button / Status */}
            {!detectedAddress ? (
              <button 
                onClick={onDetectLocation}
                disabled={isDetecting}
                className="w-full py-4 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-xl bg-purple-50 dark:bg-purple-900/10 flex flex-col items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors group"
              >
                <div className={`p-3 rounded-full bg-white dark:bg-white/10 text-purple-600 ${isDetecting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}>
                  {isDetecting ? <RefreshCw className="animate-spin" size={24} /> : <LocateFixed size={24} />}
                </div>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {isDetecting ? 'Locating you...' : 'Auto-Detect My Location'}
                </span>
              </button>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Current Location</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{detectedAddress}</p>
                  </div>
                </div>
                <button onClick={onDetectLocation} className="p-2 text-gray-400 hover:text-purple-600"><RefreshCw size={16} /></button>
              </div>
            )}

            {/* Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1"><Target size={12} /> Search Radius</label>
                <span className="text-xs font-bold bg-purple-100 dark:bg-white/10 px-2 py-1 rounded text-purple-700 dark:text-white">{radius} km</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="500" 
                step="5"
                value={radius}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>5km</span>
                <span>500km</span>
              </div>
            </div>

            {detectedAddress && (
               <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                  <Map size={10} /> Showing profiles within {radius}km of your location
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const AdvancedSearch = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  // Mock Data Options
  const EDUCATION_OPTS = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'MD', 'Ph.D', 'B.Arch', 'CA', 'IAS/IPS'];
  const PROFESSION_OPTS = ['Software Engineer', 'Doctor', 'Entrepreneur', 'Architect', 'Banker', 'Professor', 'Civil Services', 'Artist'];
  const LANGUAGES_OPTS = ['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu', 'Kannada', 'French'];
  const JOB_TYPES = ['Private', 'Government', 'Business', 'Defence', 'Self Employed'];
  const DIET_OPTS = ['Veg', 'Non-Veg', 'Eggetarian', 'Vegan'];

  const handleDetectLocation = () => {
    setIsDetectingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTimeout(() => {
            setFilters(prev => ({
              ...prev,
              locationMode: 'gps',
              gpsCoordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
              detectedAddress: 'Chennai, T-Nagar' // Mock Reverse Geocoding
            }));
            setIsDetectingLoc(false);
          }, 1500); // Simulate API delay
        },
        (err) => {
          console.error(err);
          alert("Location access denied or unavailable. Please use manual entry.");
          setIsDetectingLoc(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsDetectingLoc(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setHasSearched(true);
    setResults([]); // Clear previous
    setShowFilters(false); // Close mobile filters
    
    // Simulate complex backend query delay
    setTimeout(() => {
      const allProfiles = generateMockProfiles(25);
      
      // Mock Filtering Logic & Distance Calculation
      const filtered = allProfiles.map(p => {
        // Mock distance if GPS is active
        let distance = undefined;
        if (filters.locationMode === 'gps' && filters.gpsCoordinates) {
           // Simulate distance based on radius (random logic for demo)
           // In real app, this would use Haversine formula against profile lat/lng
           const randomDist = Math.floor(Math.random() * (filters.gpsRadius + 20)); // Some inside, some outside
           if (randomDist <= filters.gpsRadius) {
              distance = `${randomDist} km away`;
           } else {
              return null; // Filter out if outside radius
           }
        }

        return {
          ...p,
          matchScore: Math.floor(Math.random() * (99 - 70) + 70), // Mock high relevance scores for advanced search
          distance
        };
      }).filter(Boolean); // Remove nulls

      setResults(filtered);
      setLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setHasSearched(false);
    setResults([]);
  };

  const toggleArrayItem = (key, value) => {
    setFilters(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
      };
    });
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
                  p-6 overflow-y-auto custom-scrollbar h-full lg:h-[calc(100vh-140px)] lg:rounded-2xl lg:shadow-none shadow-2xl
                  ${!showFilters ? 'hidden lg:block' : 'block'}
               `}
            >
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Filter size={20} className="text-purple-600" /> Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                     <X size={20} />
                  </button>
               </div>

               <div className="space-y-8 pb-10">
                  {/* Basic Ranges with Gradient Sliders */}
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                           <label className="text-xs font-bold uppercase text-gray-500">Age Range</label>
                           <span className="text-xs font-bold bg-purple-100 dark:bg-white/10 px-2 py-1 rounded text-purple-700 dark:text-white">
                              {filters.ageRange[0]} - {filters.ageRange[1]} Yrs
                           </span>
                        </div>
                        <GradientRangeSlider 
                           min={18} max={70} 
                           value={filters.ageRange} 
                           onChange={val => setFilters(prev => ({...prev, ageRange: val}))} 
                        />
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                           <label className="text-xs font-bold uppercase text-gray-500">Height (cm)</label>
                           <span className="text-xs font-bold bg-purple-100 dark:bg-white/10 px-2 py-1 rounded text-purple-700 dark:text-white">
                              {filters.heightRange[0]} - {filters.heightRange[1]} cm
                           </span>
                        </div>
                        <GradientRangeSlider 
                           min={140} max={220} 
                           value={filters.heightRange} 
                           onChange={val => setFilters(prev => ({...prev, heightRange: val}))} 
                        />
                     </div>
                  </div>

                  {/* 1. Professional */}
                  <div>
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase size={16} className="text-purple-500" /> Education & Career
                     </h4>
                     <div className="space-y-4">
                        <MultiSelectChips 
                           label="Education" 
                           options={EDUCATION_OPTS} 
                           selected={filters.education} 
                           onChange={val => setFilters(prev => ({...prev, education: val}))} 
                        />
                        <MultiSelectChips 
                           label="Profession" 
                           options={PROFESSION_OPTS} 
                           selected={filters.profession} 
                           onChange={val => setFilters(prev => ({...prev, profession: val}))} 
                        />
                        
                        {/* Salary Slider */}
                        <div className="space-y-3 pt-2">
                           <div className="flex justify-between items-center">
                              <label className="text-xs font-bold uppercase text-gray-500">Annual Income</label>
                              <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-green-700 dark:text-green-300">
                                 ₹{filters.salaryRange[0]}L - ₹{filters.salaryRange[1]}L
                              </span>
                           </div>
                           <GradientRangeSlider 
                              min={0} max={100} 
                              value={filters.salaryRange} 
                              onChange={val => setFilters(prev => ({...prev, salaryRange: val}))} 
                           />
                        </div>
                     </div>
                  </div>

                  {/* 2. Cultural */}
                  <div>
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Moon size={16} className="text-purple-500" /> Horoscope & Cultural
                     </h4>
                     <div className="space-y-4">
                        <AnimatedSelect 
                           label="Religion" 
                           options={[{label:'Hindu', value:'Hindu'}, {label:'Christian', value:'Christian'}, {label:'Muslim', value:'Muslim'}]} 
                           value={filters.religion} 
                           onChange={(e) => setFilters(prev => ({...prev, religion: e.target.value}))}
                           className="!mb-0"
                        />
                        <AnimatedInput 
                           label="Caste" 
                           value={filters.caste} 
                           onChange={(e) => setFilters(prev => ({...prev, caste: e.target.value}))}
                           className="!mb-0"
                        />
                        <MultiSelectChips 
                           label="Raasi (Moon Sign)" 
                           options={RAASI_LIST.map(r => r.english)} 
                           selected={filters.raasi} 
                           onChange={val => setFilters(prev => ({...prev, raasi: val}))} 
                        />
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-xl border border-purple-500/20 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Sparkles size={14} className="text-purple-500" />
                              <span className="text-xs font-bold text-gray-900 dark:text-white">AI Horoscope Match</span>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={filters.matchHoroscope} onChange={() => setFilters(prev => ({...prev, matchHoroscope: !prev.matchHoroscope}))} className="sr-only peer" />
                              <div className="w-8 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="sticky bottom-0 pt-4 bg-white/95 dark:bg-black/95 backdrop-blur lg:bg-transparent pb-4">
                     <div className="flex gap-2">
                        <button onClick={handleReset} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/10 rounded-xl">Clear</button>
                        <PremiumButton onClick={handleSearch} className="!py-3 !px-6 !text-sm flex-1">Apply Filters</PremiumButton>
                     </div>
                  </div>
               </div>
            </motion.aside>
         )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0">
         
         {/* Top Bar */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
               <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <SlidersHorizontal className="text-purple-600 dark:text-gold-400" />
                  Advanced Search
               </h2>
               <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Refine your partner search with detailed preferences.
               </p>
            </div>
            <button 
               onClick={() => setShowFilters(true)}
               className="lg:hidden w-full md:w-auto p-3 bg-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 font-bold"
            >
               <Filter size={18} /> Open Filters
            </button>
         </div>

         {/* Proximity Banner */}
         <div className="mb-8">
            <FilterSection title="Lifestyle & Proximity" icon={<Coffee size={20} />} delay={0.1}>
               <ProximitySearch 
                  mode={filters.locationMode}
                  manualValue={filters.manualLocation}
                  radius={filters.gpsRadius}
                  detectedAddress={filters.detectedAddress}
                  isDetecting={isDetectingLoc}
                  onModeChange={(mode) => setFilters(prev => ({...prev, locationMode: mode}))}
                  onManualChange={(val) => setFilters(prev => ({...prev, manualLocation: val}))}
                  onRadiusChange={(val) => setFilters(prev => ({...prev, gpsRadius: val}))}
                  onDetectLocation={handleDetectLocation}
               />
            </FilterSection>
         </div>

         {/* RESULTS SECTION */}
         <AnimatePresence mode="wait">
            {hasSearched && (
               <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Search Results <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({results.length} matches found)</span>
                     </h3>
                     
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase hidden md:inline">Sort By:</span>
                        <select className="bg-transparent text-sm font-bold text-purple-600 outline-none cursor-pointer">
                           <option>Relevance (AI)</option>
                           {filters.locationMode === 'gps' && <option>Distance (Nearest)</option>}
                           <option>Newest First</option>
                           <option>Last Active</option>
                        </select>
                     </div>
                  </div>

                  {loading ? (
                     <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {[1,2,3,4,5].map(i => (
                           <div key={i} className="aspect-[4/5] bg-white/40 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] animate-pulse" />
                        ))}
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {results.length > 0 ? results.map((profile, idx) => (
                           <div key={profile.id} className="relative">
                              <MatchCard 
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
                              {profile.distance && (
                                 <div className="absolute top-3 left-3 z-30 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Navigation size={10} className="text-blue-400" /> {profile.distance}
                                 </div>
                              )}
                           </div>
                        )) : (
                           <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                 <Search size={32} />
                              </div>
                              <h3 className="text-lg font-bold">No Matches Found</h3>
                              <p className="text-gray-500 text-sm">Try relaxing your search criteria or increasing the search radius.</p>
                           </div>
                        )}
                     </div>
                  )}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedSearch;
