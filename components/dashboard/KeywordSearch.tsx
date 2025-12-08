
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Tag, RefreshCw, Briefcase, MapPin, Building2, GraduationCap, ChevronRight, Plus } from 'lucide-react';
import { generateMockProfiles, Profile } from '../../utils/mockData';
import { MatchCard } from './DashboardWidgets';
import PremiumButton from '../ui/PremiumButton';

const KeywordSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState(['Software Engineer', 'Chennai', 'Doctor', 'USA', 'Iyer']);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock database of unique values for auto-suggest
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);

  useEffect(() => {
    // Simulate extracting unique values from a large dataset
    const profiles = generateMockProfiles(50);
    const values = new Set<string>();
    profiles.forEach(p => {
      values.add(p.occupation);
      values.add(p.location.split(',')[0]); // City
      values.add(p.education);
      // Mock company names and colleges as they aren't in standard mockData yet
      values.add('TCS'); values.add('Infosys'); values.add('Anna University'); values.add('IIT Madras');
      values.add('Google'); values.add('Microsoft'); values.add('Apollo Hospitals');
    });
    setUniqueValues(Array.from(values));
  }, []);

  // Debounced Auto-Suggest
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        const matches = uniqueValues.filter(v => 
          v.toLowerCase().includes(query.toLowerCase()) && !keywords.includes(v)
        );
        setSuggestions(matches.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, uniqueValues, keywords]);

  // Debounced Search Execution
  useEffect(() => {
    if (keywords.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const allProfiles = generateMockProfiles(30);
      const filtered = allProfiles.filter(p => {
        // Check if profile matches ANY of the keywords in relevant fields
        return keywords.some(k => {
          const lowerK = k.toLowerCase();
          return (
            p.occupation.toLowerCase().includes(lowerK) ||
            p.location.toLowerCase().includes(lowerK) ||
            p.education.toLowerCase().includes(lowerK) ||
            p.about.toLowerCase().includes(lowerK) ||
            // Mock matches for company/college
            (Math.random() > 0.8) // Simulate random match for company since it's not in base mock
          );
        });
      });
      
      // Add match scores
      const resultsWithScores = filtered.map(p => ({
        ...p,
        matchScore: Math.floor(Math.random() * (99 - 70) + 70)
      }));

      setResults(resultsWithScores);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [keywords]);

  const addKeyword = (k: string) => {
    if (k && !keywords.includes(k)) {
      setKeywords(prev => [...prev, k]);
      setQuery('');
      setSuggestions([]);
      inputRef.current?.focus();
    }
  };

  const removeKeyword = (k: string) => {
    setKeywords(prev => prev.filter(item => item !== k));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
      addKeyword(query);
    }
    if (e.key === 'Backspace' && !query && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const saveCurrentSearch = () => {
    const tag = keywords.join(' + ');
    if (!savedSearches.includes(tag)) {
      setSavedSearches(prev => [tag, ...prev]);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Tag className="text-purple-600 dark:text-gold-400" />
            Keyword Search
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Filter by Company, College, Native Place, or any specific term.
          </p>
        </div>
      </div>

      {/* Search Container */}
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-xl relative z-20">
        
        {/* Input Field Area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-2 flex flex-wrap gap-2 items-center min-h-[72px] transition-all duration-300 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:bg-white/80 dark:focus-within:bg-black/60">
            <Search className="text-gray-400 ml-3 shrink-0" size={24} />
            
            {/* Active Keywords */}
            <AnimatePresence>
              {keywords.map(k => (
                <motion.span
                  key={k}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-200 rounded-xl text-sm font-bold shadow-sm border border-purple-200 dark:border-purple-500/30"
                >
                  {k}
                  <button onClick={() => removeKeyword(k)} className="hover:text-purple-900 dark:hover:text-white p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-white/10 transition-colors">
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Input */}
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length === 0 ? "Type keywords like 'Software Engineer', 'IIT', 'Coimbatore'..." : "Add another keyword..."}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 min-w-[200px] h-10 px-2"
            />
            
            {keywords.length > 0 && (
               <button onClick={() => setKeywords([])} className="mr-2 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                  <X size={20} />
               </button>
            )}
          </div>

          {/* Auto-Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={s}
                    onClick={() => addKeyword(s)}
                    className="w-full text-left px-6 py-3.5 hover:bg-purple-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-0 group"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 group-hover:text-purple-600 dark:group-hover:text-gold-400 transition-colors">
                       <Tag size={16} />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:translate-x-1 transition-transform">
                      {s.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                        part.toLowerCase() === query.toLowerCase() ? <span key={i} className="text-purple-600 dark:text-gold-400 font-bold">{part}</span> : part
                      )}
                    </span>
                    <ChevronRight size={16} className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved Searches / Quick Chips */}
        <div className="mt-6">
           <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Quick Filters</span>
              {keywords.length > 0 && (
                 <button onClick={saveCurrentSearch} className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline">
                    <Plus size={12} /> Save Search
                 </button>
              )}
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar mask-gradient-right">
              {savedSearches.map((tag, idx) => (
                 <button
                    key={idx}
                    onClick={() => {
                        const newKeys = tag.includes(' + ') ? tag.split(' + ') : [tag];
                        setKeywords(newKeys);
                    }}
                    className="whitespace-nowrap px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-white/10 hover:border-purple-200 dark:hover:border-white/20 transition-all flex items-center gap-2 group"
                 >
                    <Search size={14} className="text-gray-400 group-hover:text-purple-500" />
                    {tag}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
         {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="aspect-[4/5] bg-white/40 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] animate-pulse border border-white/20" />
               ))}
            </div>
         ) : results.length > 0 ? (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
            >
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
            </motion.div>
         ) : keywords.length > 0 ? (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/10"
            >
               <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-6">
                  <Search size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">No matches found</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Try checking your spelling or using broader keywords.</p>
               <button onClick={() => setKeywords([])} className="mt-6 text-purple-600 font-bold hover:underline">Clear Keywords</button>
            </motion.div>
         ) : (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-32 text-center"
            >
               <div className="w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl absolute -z-10" />
               <Tag size={48} className="text-purple-300 dark:text-gray-700 mb-4" />
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Start Typing to Search</h3>
               <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
                  Enter keywords like "TCS", "Anna University", "Chennai", "Doctor" to find profiles with specific attributes.
               </p>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default KeywordSearch;
