
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Eye, Heart, Star, Sparkles, ChevronRight, ArrowUpRight, Lock, Shield, 
  CheckCircle, Zap, Calendar, X
} from 'lucide-react';
import { DashboardSidebar, DashboardHeader, MatchCard, StatCard, RequestCard, EventCard, SectionHeader } from './DashboardWidgets';
import ProfileSetupWizard from './ProfileSetupWizard';
import PhotosVideoModule from './PhotosVideoModule';
import MatchesView from './MatchesView';
import IdVerification from './IdVerification';
import HoroscopePage from './HoroscopePage';
import ProfileEnhancement from './ProfileEnhancement';
import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import KeywordSearch from './KeywordSearch';
import CommunitySearch from './CommunitySearch';
import CommunicationCenter from './CommunicationCenter';
import MembershipPage from './MembershipPage';
import ProfileDetailModal from './ProfileDetailModal';
import { ConnectionsView, InterestsView, ShortlistView, ActivityView, EventsView, VisitorsView } from './InteractionViews';
import PremiumButton from '../ui/PremiumButton';
import { generateMockProfiles, MOCK_REQUESTS, MOCK_EVENTS, Profile, ActivityLog } from '../../utils/mockData';

interface UserDashboardProps {
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

// Simple Toast Notification Component
const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => (
   <motion.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
   >
      <CheckCircle size={20} className="text-green-500" />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={16} /></button>
   </motion.div>
);

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, toggleTheme, darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'photos' | 'matches' | 'search' | 'advanced-search' | 'keyword-search' | 'community-search' | 'verification' | 'messages' | 'horoscope' | 'enhancements' | 'membership' | 'connections' | 'interests' | 'shortlist' | 'activity' | 'events' | 'visitors'>('overview');
  
  // Data States
  const [activeMatchTab, setActiveMatchTab] = useState<'daily' | 'premium' | 'new'>('daily');
  const [matches, setMatches] = useState<Profile[]>([]);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [interests, setInterests] = useState<any[]>([]); // Mock received interests
  const [shortlisted, setShortlisted] = useState<Profile[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  
  // Modal State
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<string | null>(null);

  // Verification State Lifted for Access Control
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'under_review' | 'verified' | 'rejected'>(() => {
    const email = localStorage.getItem('mdm_email');
    const demoEmails = ['demo@user.com', 'demo@broker.com', 'demo@parent.com'];
    if (email && demoEmails.includes(email)) return 'verified';
    return 'idle';
  });

  // Load Mock Data
  useEffect(() => {
    const pool = generateMockProfiles(30);
    const scored = pool.map(p => ({...p, matchScore: Math.floor(Math.random() * (98 - 70) + 70)}));
    setMatches(scored);
  }, []);

  // --- ACTIONS ---

  const showToast = (msg: string) => {
     setToast(msg);
     setTimeout(() => setToast(null), 3000);
  };

  const logActivity = (type: ActivityLog['type'], description: string, profile?: Profile) => {
     const newLog: ActivityLog = {
        id: Date.now().toString(),
        type,
        description,
        timestamp: 'Just now',
        profileImage: profile?.img,
        profileName: profile?.name
     };
     setActivityLog(prev => [newLog, ...prev]);
  };

  const handleConnect = (profile: Profile) => {
     // Check if already connected/requested? (Simplified: just fire)
     logActivity('connect', `Sent connection request to ${profile.name}`, profile);
     showToast(`Request sent to ${profile.name}`);
     // Ideally add to an "outgoing requests" state here
  };

  const handleInterest = (profile: Profile) => {
     logActivity('interest', `Expressed interest in ${profile.name}`, profile);
     showToast(`Interest sent to ${profile.name}`);
  };

  const handleShortlist = (profile: Profile) => {
     const exists = shortlisted.find(p => p.id === profile.id);
     if (exists) {
        setShortlisted(prev => prev.filter(p => p.id !== profile.id));
        showToast(`Removed ${profile.name} from shortlist`);
     } else {
        setShortlisted(prev => [profile, ...prev]);
        logActivity('shortlist', `Shortlisted ${profile.name}`, profile);
        showToast(`Shortlisted ${profile.name}`);
     }
  };

  const handleViewProfile = (profile: Profile) => {
     setViewProfile(profile);
     logActivity('view', `Viewed profile of ${profile.name}`, profile);
  };

  const handleAcceptRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id.toString() !== id));
    logActivity('connect', 'Accepted connection request');
    showToast('Connection Accepted');
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id.toString() !== id));
    showToast('Request Declined');
  };

  // --- FILTER HELPERS ---
  const getFilteredMatches = () => {
    if (activeMatchTab === 'premium') return matches.filter(m => m.isPremium).slice(0, 6);
    if (activeMatchTab === 'new') return matches.filter(m => m.isNew).slice(0, 6);
    return matches.slice(0, 6); 
  };

  if (showSetupWizard) {
    return <ProfileSetupWizard onComplete={() => setShowSetupWizard(false)} onExit={() => setShowSetupWizard(false)} />;
  }

  // --- RENDER CONTENT SWITCHER ---
  const renderContent = () => {
    if ((currentView === 'matches' || currentView === 'messages' || currentView === 'search' || currentView === 'advanced-search' || currentView === 'keyword-search' || currentView === 'community-search') && verificationStatus !== 'verified') {
       return (
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/10"
         >
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-xl shadow-red-500/20">
               <Lock size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Access Restricted</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8">
               To view full profiles, search securely, and send messages, you must verify your government ID. This ensures a safe environment for all members.
            </p>
            <PremiumButton 
               onClick={() => setCurrentView('verification')}
               icon={<Shield size={18} />}
               variant="gradient"
            >
               Verify Identity Now
            </PremiumButton>
         </motion.div>
       );
    }

    switch (currentView) {
       case 'photos': return <PhotosVideoModule />;
       case 'matches': return <MatchesView onConnect={handleConnect} onInterest={handleInterest} onShortlist={handleShortlist} onViewProfile={handleViewProfile} />;
       case 'search': return <BasicSearch />;
       case 'advanced-search': return <AdvancedSearch />;
       case 'keyword-search': return <KeywordSearch />;
       case 'community-search': return <CommunitySearch />;
       case 'horoscope': return <HoroscopePage />;
       case 'verification': return <IdVerification currentStatus={verificationStatus} onStatusChange={setVerificationStatus} />;
       case 'enhancements': return <ProfileEnhancement />;
       case 'messages': return <CommunicationCenter />;
       case 'membership': return <MembershipPage />;
       case 'connections': return <ConnectionsView requests={requests} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} onViewProfile={handleViewProfile} />;
       case 'interests': return <InterestsView interests={interests} onViewProfile={handleViewProfile} />;
       case 'shortlist': return <ShortlistView shortlisted={shortlisted} onConnect={handleConnect} onRemove={(id) => {}} onViewProfile={handleViewProfile} />;
       case 'activity': return <ActivityView activityLog={activityLog} />;
       case 'events': return <EventsView />;
       case 'visitors': return <VisitorsView visitors={generateMockProfiles(10).map((p, i) => ({ id: i.toString(), profile: p, visitTime: `${i+2}h ago`, visitCount: 1 }))} />;
       default:
          // OVERVIEW DASHBOARD
          return (
            <div className="space-y-8 md:space-y-12 pb-20">
              {/* 1. HERO WELCOME SECTION */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden p-6 md:p-12 text-white shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 animate-gradient-x bg-[length:200%_auto]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20"
                    >
                      <Sparkles size={12} /> Premium Member
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
                      Good Morning, <br/> Karthik
                    </h1>
                    <p className="text-purple-100 max-w-lg text-base md:text-lg leading-relaxed opacity-90">
                      You have <strong>{requests.length} new requests</strong> and <strong>12 new matches</strong> waiting for you today.
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl shrink-0">
                      <div className="text-center">
                        <span className="block text-3xl font-bold">85%</span>
                        <span className="text-[10px] uppercase opacity-80 tracking-wide">Completed</span>
                      </div>
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <motion.circle 
                          cx="50%" cy="50%" r="48%" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 0.85 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                      </svg>
                  </div>
                </div>
              </motion.section>

              {/* 2. STATS GRID */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div onClick={() => setCurrentView('visitors')} className="cursor-pointer">
                   <StatCard label="Profile Views" value="124" trend="+12%" icon={<Eye size={24} />} color="bg-blue-500" />
                </div>
                <div onClick={() => setCurrentView('interests')} className="cursor-pointer">
                   <StatCard label="Interests" value={interests.length || 8} trend="+2" icon={<Heart size={24} />} color="bg-pink-500" />
                </div>
                <div onClick={() => setCurrentView('shortlist')} className="cursor-pointer">
                   <StatCard label="Shortlisted" value={shortlisted.length || 15} icon={<Star size={24} />} color="bg-amber-500" />
                </div>
                <div onClick={() => setCurrentView('matches')} className="cursor-pointer">
                   <StatCard label="Matches" value="42" icon={<Users size={24} />} color="bg-purple-500" />
                </div>
              </section>

              {/* 3. PENDING REQUESTS */}
              <section>
                 <SectionHeader title="Pending Requests" subtitle="People who want to connect with you" action="View All" onAction={() => setCurrentView('connections')} />
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                       {requests.length > 0 ? (
                          requests.slice(0, 3).map((req) => (
                             <RequestCard 
                                key={req.id} 
                                request={req} 
                                onAccept={(id) => handleAcceptRequest(id.toString())} 
                                onDecline={(id) => handleDeclineRequest(id.toString())} 
                             />
                          ))
                       ) : (
                          <div className="col-span-1 md:col-span-3 text-center py-8 text-gray-500 bg-white/40 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                             <p>No pending requests.</p>
                          </div>
                       )}
                    </AnimatePresence>
                 </div>
              </section>

              {/* 4. MATCHES ZONE (Segmented) */}
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">Your Matches</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Curated profiles based on your preferences</p>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl self-start sm:self-auto">
                       {(['daily', 'premium', 'new'] as const).map(tab => (
                          <button
                             key={tab}
                             onClick={() => setActiveMatchTab(tab)}
                             className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                activeMatchTab === tab 
                                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                             }`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                </div>

                <div className="overflow-x-auto pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                   <div className="flex gap-6">
                      {getFilteredMatches().map((match, idx) => (
                         <div key={match.id} className="w-[280px] md:w-[320px] flex-shrink-0">
                             <MatchCard 
                                match={{...match, job: match.occupation, image: match.img}} 
                                delay={idx * 0.1}
                                onConnect={() => handleConnect(match)}
                                onInterest={() => handleInterest(match)}
                                onShortlist={() => handleShortlist(match)}
                                onViewProfile={() => handleViewProfile(match)}
                             />
                         </div>
                      ))}
                   </div>
                </div>
              </section>

              <div className="grid lg:grid-cols-3 gap-8">
                 {/* 5. HOROSCOPE HIGHLIGHTS */}
                 <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-black rounded-[2.5rem] p-6 md:p-8 border border-purple-100 dark:border-white/10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-purple-500/5 rounded-full blur-3xl" />
                    <SectionHeader title="Stars Aligned" subtitle="Highly compatible horoscope matches" />
                    
                    <div className="space-y-4">
                       {matches.filter(m => m.matchScore > 90).slice(0, 3).map((match, i) => (
                          <div key={i} onClick={() => handleViewProfile(match)} className="flex flex-col sm:flex-row items-center sm:items-center gap-4 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/5 hover:border-purple-200 transition-all cursor-pointer group text-center sm:text-left">
                             <img src={match.img} alt={match.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-white/10 shadow-md" />
                             <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{match.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{match.raasi} • {match.nakshatra}</p>
                                <div className="flex gap-2 mt-1 justify-center sm:justify-start">
                                   <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">Porutham 9/10</span>
                                </div>
                             </div>
                             <div className="text-right w-full sm:w-auto flex justify-between sm:block items-center px-4 sm:px-0">
                                <span className="sm:hidden text-sm font-bold text-gray-500">Match Score</span>
                                <div>
                                   <span className="block text-2xl font-bold text-green-500">{match.matchScore}%</span>
                                   <span className="text-[10px] text-gray-400 uppercase hidden sm:block">Match</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* 6. RECENT VISITORS */}
                 <div className="space-y-6">
                    <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold">Recent Visitors</h3>
                          <button onClick={() => setCurrentView('visitors')} className="text-xs font-bold text-purple-600 hover:underline">View All</button>
                       </div>
                       <div className="grid grid-cols-4 gap-4">
                          {[1,2,3,4,5,6,7,8].map((i) => (
                             <div key={i} className="relative group cursor-pointer aspect-square">
                                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                                {i > 4 && (
                                   <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                                      <Lock size={12} className="text-white" />
                                   </div>
                                )}
                             </div>
                          ))}
                       </div>
                       <p className="text-xs text-center text-gray-400 mt-4">Upgrade to see all visitors</p>
                       <button onClick={() => setCurrentView('membership')} className="w-full mt-2 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                          Unlock Visitors
                       </button>
                    </div>
                 </div>
              </div>

              {/* 7. COMMUNITY EVENTS */}
              <section>
                 <SectionHeader title="Community Events" subtitle="Meetups and exclusive gatherings" action="View All Events" onAction={() => setCurrentView('events')} />
                 <div className="overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-6 min-w-max">
                       {MOCK_EVENTS.map((event, idx) => (
                          <EventCard key={idx} event={event} />
                       ))}
                    </div>
                 </div>
              </section>
            </div>
          );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-purple-500 selection:text-white transition-colors duration-500">
      
      {/* Toast Notification */}
      <AnimatePresence>
         {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
         {viewProfile && (
            <ProfileDetailModal 
               profile={viewProfile} 
               onClose={() => setViewProfile(null)}
               onConnect={handleConnect}
               onInterest={handleInterest}
               onShortlist={handleShortlist}
            />
         )}
      </AnimatePresence>

      {/* Sidebar */}
      <DashboardSidebar 
        collapsed={collapsed} 
        toggleCollapse={() => setCollapsed(!collapsed)} 
        onLogout={onLogout}
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as any)}
        isMobileOpen={mobileMenuOpen}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
           toggleTheme={toggleTheme} 
           darkMode={darkMode} 
           onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl 3xl:max-w-screen-2xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
