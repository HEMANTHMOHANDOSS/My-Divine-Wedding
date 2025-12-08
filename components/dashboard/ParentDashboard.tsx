
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Eye, Heart, Star, Shield, Activity, MessageCircle, Calendar, 
  Settings, LogOut, Search, User, Filter, AlertTriangle, CheckCircle, X,
  Crown, Briefcase, MapPin, Zap, Moon, Camera, UserPlus
} from 'lucide-react';
import { DashboardSidebar, DashboardHeader, MatchCard, StatCard, RequestCard, SectionHeader, SafetyScoreWidget } from './DashboardWidgets';
import MatchesView from './MatchesView';
import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import KeywordSearch from './KeywordSearch';
import CommunitySearch from './CommunitySearch';
import IdVerification from './IdVerification';
import HoroscopePage from './HoroscopePage';
import PhotosVideoModule from './PhotosVideoModule';
import ProfileEnhancement from './ProfileEnhancement';
import CommunicationCenter from './CommunicationCenter';
import MembershipPage from './MembershipPage';
import { ConnectionsView, InterestsView, ShortlistView, ActivityView } from './InteractionViews';
import ProfileSetupWizard from './ProfileSetupWizard';
import { MOCK_REQUESTS, generateMockProfiles, Profile, ActivityLog } from '../../utils/mockData';
import PremiumButton from '../ui/PremiumButton';

interface ParentDashboardProps {
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onLogout, toggleTheme, darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'matches' | 'search' | 'advanced-search' | 'keyword-search' | 'community-search' | 'requests' | 'activity' | 'family-chat' | 'child-profile' | 'photos' | 'horoscope' | 'verification' | 'enhancements' | 'membership' | 'connections' | 'interests' | 'shortlist'>('overview');
  
  // Mock Child Data
  const childName = "Sneha";
  const childProfileId = "MDM-9932";
  
  // States
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [childRequests, setChildRequests] = useState(MOCK_REQUESTS);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'under_review' | 'verified' | 'rejected'>('verified');

  // CUSTOM PARENT MENU
  const PARENT_MENU = [
    { id: 'overview', icon: <HomeIcon />, label: 'Overview' },
    { id: 'child-profile', icon: <User size={20} />, label: 'Child Profile' },
    { id: 'search', icon: <Search size={20} />, label: 'Search Matches' },
    { id: 'advanced-search', icon: <Filter size={20} />, label: 'Advanced Filter' },
    { id: 'community-search', icon: <GlobeIcon />, label: 'Community' },
    { id: 'matches', icon: <Heart size={20} />, label: 'Recommendations', badge: '12' },
    { id: 'requests', icon: <UserPlus size={20} />, label: 'Requests', badge: '3' },
    { id: 'family-chat', icon: <MessageCircle size={20} />, label: 'Communication' },
    { id: 'activity', icon: <Activity size={20} />, label: 'Activity Log' },
    { id: 'verification', icon: <Shield size={20} />, label: 'Safety & ID' },
    { id: 'photos', icon: <Camera size={20} />, label: 'Photos' },
    { id: 'horoscope', icon: <Moon size={20} />, label: 'Horoscope' },
    { id: 'membership', icon: <Crown size={20} />, label: 'Upgrade Plan' },
  ];

  const logParentAction = (desc: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type: 'parent_action',
      description: `Parent: ${desc}`,
      timestamp: 'Just now',
      actor: 'Parent'
    };
    setActivityLog(prev => [newLog, ...prev]);
  };

  const handleParentShortlist = (profile: Profile) => {
    logParentAction(`Shortlisted ${profile.name} for ${childName}`);
    alert(`Added ${profile.name} to ${childName}'s shortlist.`);
  };

  const handleParentConnect = (profile: Profile) => {
    logParentAction(`Sent interest to ${profile.name} on behalf of ${childName}`);
    alert(`Interest sent to ${profile.name} (Marked as sent by Parent).`);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'matches':
        return (
          <div className="space-y-6">
            <ParentModeBanner childName={childName} />
            <MatchesView onConnect={handleParentConnect} onShortlist={handleParentShortlist} />
          </div>
        );
      
      case 'search': return <div className="space-y-6"><ParentModeBanner childName={childName} /><BasicSearch /></div>;
      case 'advanced-search': return <div className="space-y-6"><ParentModeBanner childName={childName} /><AdvancedSearch /></div>;
      case 'keyword-search': return <div className="space-y-6"><ParentModeBanner childName={childName} /><KeywordSearch /></div>;
      case 'community-search': return <div className="space-y-6"><ParentModeBanner childName={childName} /><CommunitySearch /></div>;
      
      case 'child-profile': return <ProfileSetupWizard onComplete={() => setCurrentView('overview')} onExit={() => setCurrentView('overview')} />;
      case 'photos': return <PhotosVideoModule />;
      case 'horoscope': return <HoroscopePage />;
      case 'verification': return <IdVerification currentStatus={verificationStatus} onStatusChange={setVerificationStatus} />;
      case 'enhancements': return <ProfileEnhancement />;
      case 'membership': return <MembershipPage />;
      
      case 'family-chat': return <CommunicationCenter mode="parent" />;

      case 'requests':
        return (
           <div className="space-y-6">
              <SectionHeader title={`Requests for ${childName}`} subtitle="Manage incoming interests before your child sees them." />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {childRequests.map(req => (
                    <RequestCard 
                       key={req.id}
                       request={req}
                       onAccept={(id) => {
                          setChildRequests(prev => prev.filter(r => r.id !== Number(id)));
                          logParentAction(`Approved request from ${req.name}`);
                       }}
                       onDecline={(id) => {
                          setChildRequests(prev => prev.filter(r => r.id !== Number(id)));
                          logParentAction(`Declined request from ${req.name}`);
                       }}
                    />
                 ))}
              </div>
           </div>
        );

      case 'activity':
         return (
            <div className="space-y-6">
               <SectionHeader title="Activity Tracker" subtitle="Monitor all actions taken on this profile." />
               <div className="bg-white/60 dark:bg-white/5 rounded-[2.5rem] p-8 border border-white/20 dark:border-white/10 shadow-xl">
                  {activityLog.length === 0 ? (
                     <p className="text-center text-gray-500 py-10">No recent activity recorded.</p>
                  ) : (
                     <div className="space-y-4">
                        {activityLog.map(log => (
                           <div key={log.id} className="flex items-center gap-4 p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                 <Shield size={16} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-bold text-gray-900 dark:text-white">{log.description}</p>
                                 <p className="text-xs text-gray-500">{log.timestamp}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         );

      default:
        // Overview
        return (
          <div className="space-y-8 pb-20">
            {/* Child Profile Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                     <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" className="w-24 h-24 rounded-full border-4 border-white/30 object-cover" alt="Child" />
                     <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white">
                        85% Strength
                     </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                     <h1 className="text-3xl font-display font-bold">Managing {childName}'s Profile</h1>
                     <p className="text-blue-100 mt-1 flex items-center justify-center md:justify-start gap-2">
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">ID: {childProfileId}</span>
                        <span>•</span>
                        <span>Last active: 2h ago</span>
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => setCurrentView('child-profile')} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center gap-2">
                        <Settings size={16} /> Manage
                     </button>
                     <button onClick={() => setCurrentView('child-profile')} className="px-4 py-2 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                        Edit Profile
                     </button>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div onClick={() => setCurrentView('requests')} className="cursor-pointer">
                  <StatCard label="Pending Requests" value={childRequests.length} icon={<User size={24} />} color="bg-orange-500" />
               </div>
               <div onClick={() => setCurrentView('matches')} className="cursor-pointer">
                  <StatCard label="New Matches" value="12" icon={<Heart size={24} />} color="bg-pink-500" />
               </div>
               <StatCard label="Profile Views" value="45" trend="+5" icon={<Eye size={24} />} color="bg-blue-500" />
               <StatCard label="Shortlisted" value="8" icon={<Star size={24} />} color="bg-purple-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Safety Score */}
               <div className="lg:col-span-1">
                  <SafetyScoreWidget score={92} issues={0} />
                  
                  <div className="mt-6 bg-white dark:bg-[#151515] p-5 rounded-3xl border border-gray-100 dark:border-white/5">
                     <h4 className="font-bold mb-4">Quick Actions</h4>
                     <div className="space-y-3">
                        <button onClick={() => setCurrentView('search')} className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl flex items-center gap-3 px-4 transition-colors">
                           <Search size={18} className="text-purple-600" /> <span className="text-sm font-bold">Search Matches</span>
                        </button>
                        <button onClick={() => setCurrentView('family-chat')} className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl flex items-center gap-3 px-4 transition-colors">
                           <MessageCircle size={18} className="text-blue-500" /> <span className="text-sm font-bold">Family Chat</span>
                        </button>
                        <button onClick={() => setCurrentView('verification')} className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl flex items-center gap-3 px-4 transition-colors">
                           <Shield size={18} className="text-green-500" /> <span className="text-sm font-bold">Verify ID</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Activity Feed */}
               <div className="lg:col-span-2 bg-white/60 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-500" /> Recent Activity Sync</h3>
                  <div className="space-y-4">
                     {activityLog.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">No recent parent actions recorded.</p>
                     ) : (
                        activityLog.map(log => (
                           <div key={log.id} className="flex items-center gap-3 p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                 <Shield size={14} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-bold">{log.description}</p>
                                 <p className="text-xs text-gray-500">{log.timestamp}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-500">
      
      {/* Reusing Dashboard Sidebar but logic adjusted for Parent */}
      <DashboardSidebar 
        collapsed={collapsed} 
        toggleCollapse={() => setCollapsed(!collapsed)} 
        onLogout={onLogout}
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v as any)}
        isMobileOpen={mobileMenuOpen}
        closeMobile={() => setMobileMenuOpen(false)}
        menuItems={PARENT_MENU}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader toggleTheme={toggleTheme} darkMode={darkMode} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
           <div className="max-w-7xl mx-auto h-full">
              <AnimatePresence mode="wait">
                 <motion.div 
                   key={currentView}
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
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

const ParentModeBanner: React.FC<{ childName: string }> = ({ childName }) => (
   <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex items-center gap-3 mb-6">
      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600"><Shield size={20} /></div>
      <div>
         <h4 className="font-bold text-amber-800 dark:text-amber-200">Parent Mode Active</h4>
         <p className="text-xs text-amber-700 dark:text-amber-300">You are managing <strong>{childName}</strong>'s profile. Actions will be logged.</p>
      </div>
   </div>
);

// Icons
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GlobeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

export default ParentDashboard;
