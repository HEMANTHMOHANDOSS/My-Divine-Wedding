
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, TrendingUp, Shield, Eye, EyeOff, Lock, Globe, Crown, 
  Clock, BarChart3, CheckCircle, AlertCircle, ChevronRight, UserCheck,
  BrainCircuit, Sparkles, ArrowUpRight
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { MagneticCard } from './DashboardWidgets';
import { getProfileAnalysis, ProfileAnalysis } from '../../utils/mockAI';

const ProfileEnhancement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'highlight' | 'boost' | 'privacy'>('audit');

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Zap className="text-gold-500 fill-gold-500" />
            Profile Enhancements
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            AI-driven tools to supercharge your visibility and profile strength.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap p-1 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 w-full md:w-auto">
          {[
            { id: 'audit', label: 'AI Audit', icon: BrainCircuit },
            { id: 'highlight', label: 'Highlight', icon: Crown },
            { id: 'boost', label: 'Boost', icon: TrendingUp },
            { id: 'privacy', label: 'Privacy', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all relative ${
                activeTab === tab.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'audit' && <AiAuditSection />}
          {activeTab === 'highlight' && <HighlightSection />}
          {activeTab === 'boost' && <BoostSection />}
          {activeTab === 'privacy' && <PrivacySection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- 0. AI AUDIT SECTION ---
const AiAuditSection: React.FC = () => {
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const data = await getProfileAnalysis();
      setAnalysis(data);
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BrainCircuit size={48} className="text-purple-600 animate-pulse mb-4" />
        <p className="text-gray-500">AI is analyzing your profile...</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      
      {/* Score Card */}
      <div className="lg:col-span-1">
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl text-center relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          
          <h3 className="text-xl font-bold mb-6">Profile Strength</h3>
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="50%" cy="50%" r="45%" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="50%" cy="50%" r="45%" 
                stroke="#a855f7" strokeWidth="8" fill="none"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * (analysis?.overallScore || 0)) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-display font-bold text-gray-900 dark:text-white">
                {analysis?.overallScore}
              </span>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Good</span>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(analysis?.breakdown || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-1">
                  <span>{key}</span>
                  <span>{val}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${val === 100 ? 'bg-green-500' : (val as number) > 70 ? 'bg-purple-500' : 'bg-amber-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-3xl border border-purple-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-white/10 rounded-full text-purple-600 dark:text-purple-300">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-purple-900 dark:text-white">AI Suggestion</h4>
              <p className="text-sm text-purple-700 dark:text-gray-300">Complete these tasks to reach 100% and get 2x more matches.</p>
            </div>
          </div>
          <PremiumButton variant="gradient" className="hidden md:flex !py-2 !px-4 !text-xs">
            Boost Score
          </PremiumButton>
        </div>

        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6">Action Plan</h3>
          <div className="space-y-4">
            {analysis?.suggestions.map((suggestion, idx) => (
              <motion.div 
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all hover:shadow-lg"
              >
                <div className={`shrink-0 w-2 h-12 rounded-full ${
                  suggestion.impact === 'high' ? 'bg-red-500' : suggestion.impact === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      suggestion.impact === 'high' ? 'bg-red-100 text-red-600' : suggestion.impact === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {suggestion.impact} Impact
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{suggestion.category}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{suggestion.text}</p>
                </div>

                <button className="whitespace-nowrap px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 group-hover:bg-purple-600 group-hover:text-white">
                  {suggestion.action} <ArrowUpRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// --- 1. HIGHLIGHT SECTION ---
const HighlightSection: React.FC = () => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Control Panel */}
      <div className="space-y-6">
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-300 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Crown size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Highlighter</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Stand out in search results with a premium badge.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <p className="text-sm font-medium">Golden Ribbon on Search Cards</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <p className="text-sm font-medium">Priority Placement in Similar Matches</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <p className="text-sm font-medium">Subtle Glow Animation on Hover</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-100 dark:border-white/10">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Status</p>
              <p className={`text-sm font-bold ${isHighlighted ? 'text-green-500' : 'text-gray-500'}`}>
                {isHighlighted ? 'Active' : 'Inactive'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isHighlighted} onChange={() => setIsHighlighted(!isHighlighted)} className="sr-only peer" />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gold-400 peer-checked:to-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="relative flex items-center justify-center bg-gray-100 dark:bg-black/40 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/20 p-8 overflow-hidden min-h-[400px]">
        <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-gray-400">Live Preview</div>
        
        <MagneticCard>
          <motion.div 
            layout
            className={`
              relative w-72 bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500
              ${isHighlighted ? 'ring-4 ring-gold-400/50 shadow-gold-500/20' : ''}
            `}
          >
            {isHighlighted && (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/20 to-transparent pointer-events-none z-10" />
                <div className="absolute top-4 right-0 bg-gradient-to-r from-gold-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-l-full shadow-lg z-20 flex items-center gap-1">
                  <Crown size={10} /> FEATURED
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-orange-500 rounded-3xl blur opacity-20 -z-10 animate-pulse" />
              </>
            )}

            <div className="h-48 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Preview" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">Karthik R.</h4>
              <p className="text-sm text-gray-500">28 yrs, 5'10"</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">Software Engineer, Chennai</p>
            </div>
          </motion.div>
        </MagneticCard>
      </div>
    </div>
  );
};

// --- 2. BOOST SECTION ---
const BoostSection: React.FC = () => {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [stats, setStats] = useState({ views: 42, clicks: 12 });

  useEffect(() => {
    let interval: any;
    if (active && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Simulate fake stats increasing
        if (Math.random() > 0.7) setStats(prev => ({ ...prev, views: prev.views + 1 }));
        if (Math.random() > 0.9) setStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
      }, 1000);
    } else if (timeLeft === 0) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, timeLeft]);

  const handleBoost = () => {
    setTimeLeft(3600); // 1 hour boost
    setActive(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${Math.floor(m/60)}:${(m%60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Boost Card */}
      <div className="lg:col-span-2 bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-purple-500" /> Boost Profile
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Push your profile to the top of search results for 60 minutes.</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-300">
            3 Boosts Left
          </div>
        </div>

        {active ? (
          <div className="text-center py-8">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/30 mb-6"
            >
              <Zap size={40} className="fill-white" />
            </motion.div>
            <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white tabular-nums mb-2">
              {formatTime(timeLeft)}
            </h2>
            <p className="text-green-500 font-medium animate-pulse">Boost Active! You are visible at the top.</p>
          </div>
        ) : (
          <div className="text-center py-10">
             <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-6">
               <Zap size={32} />
             </div>
             <PremiumButton onClick={handleBoost} variant="gradient" width="full" className="max-w-xs mx-auto">
               Activate Boost Now
             </PremiumButton>
             <p className="text-xs text-gray-400 mt-4">Cooldown period applies after boost ends.</p>
          </div>
        )}
      </div>

      {/* Analytics Card */}
      <div className="space-y-6">
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 shadow-xl">
          <h4 className="font-bold flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-blue-500" /> Live Impact
          </h4>
          <div className="space-y-4">
            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div className="text-xs text-gray-500 uppercase font-bold">Profile Views</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-end gap-2">
                {stats.views} <span className="text-xs text-green-500 mb-1">+{Math.floor(stats.views * 0.1)}%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div className="text-xs text-gray-500 uppercase font-bold">Interactions</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-end gap-2">
                {stats.clicks} <span className="text-xs text-green-500 mb-1">+{Math.floor(stats.clicks * 0.2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-white/5 flex gap-3">
           <AlertCircle className="text-orange-500 shrink-0" size={20} />
           <p className="text-xs text-orange-800 dark:text-orange-200">
             <strong>Pro Tip:</strong> Boosting on weekends between 6 PM - 9 PM gets 3x more views.
           </p>
        </div>
      </div>
    </div>
  );
};

// --- 3. PRIVACY SECTION ---
const PrivacySection: React.FC = () => {
  const [settings, setSettings] = useState({
    photoVisibility: 'all',
    blurPhotos: false,
    nameVisibility: 'all',
    contactVisibility: 'verified',
    communityLock: false
  });

  const toggleSetting = (key: keyof typeof settings, val: any) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
          <Shield size={32} />
        </div>
        <h3 className="text-2xl font-bold">Advanced Privacy Controls</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Control exactly who sees what on your profile.</p>
      </div>

      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
        
        {/* Photo Settings */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye size={18} className="text-purple-500" /> Photo Visibility
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {['all', 'matches', 'verified'].map((opt) => (
              <button
                key={opt}
                onClick={() => toggleSetting('photoVisibility', opt)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  settings.photoVisibility === opt
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {opt === 'all' && <Globe size={20} className="mb-2" />}
                {opt === 'matches' && <UserCheck size={20} className="mb-2" />}
                {opt === 'verified' && <Shield size={20} className="mb-2" />}
                <span className="capitalize text-sm font-bold">{opt === 'all' ? 'Everyone' : opt === 'matches' ? 'Matches Only' : 'Verified Only'}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
             <div className="flex items-center gap-3">
                <EyeOff size={20} className="text-gray-500" />
                <div>
                   <p className="text-sm font-bold">Blur Photos</p>
                   <p className="text-xs text-gray-500">Photos are blurred until you accept a request.</p>
                </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.blurPhotos} onChange={() => toggleSetting('blurPhotos', !settings.blurPhotos)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
           <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock size={18} className="text-purple-500" /> Contact Details
          </h4>
          <div className="flex flex-col gap-3">
             {[
               { id: 'all', label: 'Visible to Premium Members', desc: 'Allows paid members to view number.' },
               { id: 'verified', label: 'Visible to Verified Profiles', desc: 'Only government ID verified users.' },
               { id: 'request', label: 'Hide (On Request)', desc: 'Users must send interest to view contact.' },
             ].map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleSetting('contactVisibility', item.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                     settings.contactVisibility === item.id 
                     ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
                     : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                   <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.contactVisibility === item.id ? 'border-purple-600' : 'border-gray-400'}`}>
                      {settings.contactVisibility === item.id && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Community Lock */}
        <div className="p-6 flex items-center justify-between bg-gray-50 dark:bg-black/30">
           <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Globe size={18} className="text-purple-500" /> Community Lock
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                 Only show my profile to people within my specific community (Caste/Sub-caste) and Religion.
              </p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.communityLock} onChange={() => toggleSetting('communityLock', !settings.communityLock)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
        </div>

      </div>
      
      <div className="flex justify-end pt-4">
         <PremiumButton variant="gradient" icon={<CheckCircle size={18} />}>
            Save Privacy Settings
         </PremiumButton>
      </div>
    </div>
  );
};

export default ProfileEnhancement;
