
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Menu, X, Home, Users, MessageCircle, Heart, 
  Settings, LogOut, Star, TrendingUp, Calendar, Zap, ChevronRight,
  MoreVertical, Shield, Camera, Moon, Check, MapPin, Clock, ArrowRight,
  SlidersHorizontal, Sun, Tag, Globe, Crown, Loader2, CheckCircle, Eye,
  Activity, AlertTriangle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Logo from '../ui/Logo';
import useTranslation from '../../hooks/useTranslation';

// --- MAGNETIC CARD WRAPPER ---
export const MagneticCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 768) return; // Disable on mobile
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.1, y: y * 0.1 }); 
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- SECTION HEADER ---
export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: string; onAction?: () => void }> = ({ title, subtitle, action, onAction }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
    <div>
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {action && (
      <button 
        onClick={onAction} 
        className="group flex items-center gap-1 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
      >
        {action} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </div>
);

// --- SAFETY SCORE WIDGET (New) ---
export const SafetyScoreWidget: React.FC<{ score: number; issues: number }> = ({ score, issues }) => {
  return (
    <div className="bg-white dark:bg-[#151515] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg relative overflow-hidden">
       <div className="flex justify-between items-start">
          <div>
             <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className={score > 80 ? "text-green-500" : "text-amber-500"} />
                Safety & Reputation
             </h4>
             <p className="text-xs text-gray-500 mt-1">Based on behavior & verification</p>
          </div>
          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${score > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
             {score > 80 ? 'Good' : 'Needs Attention'}
          </div>
       </div>
       
       <div className="mt-4 flex items-end gap-4">
          <div className="text-4xl font-display font-bold text-gray-900 dark:text-white">{score}</div>
          <div className="flex-1 pb-2">
             <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${score}%` }} 
                   className={`h-full ${score > 80 ? 'bg-green-500' : 'bg-amber-500'}`} 
                />
             </div>
          </div>
       </div>

       {issues > 0 ? (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
             <AlertTriangle size={14} /> {issues} potential flags detected.
          </div>
       ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
             <CheckCircle size={14} /> No safety issues detected.
          </div>
       )}
    </div>
  );
};

// --- REQUEST CARD ---
interface RequestCardProps {
  request: {
    id: number;
    name: string;
    age: number;
    profession: string;
    location: string;
    img: string;
    compatibility: number;
    time: string;
  };
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onDecline }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-[#151515] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
    >
      <div className="relative shrink-0">
        <img src={request.img} alt={request.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover" />
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black p-0.5 rounded-full">
           <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
             {request.compatibility}%
           </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm md:text-base">{request.name}, {request.age}</h4>
        <p className="text-xs text-gray-500 truncate">{request.profession} • {request.location}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
           <Clock size={10} /> {request.time}
        </p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onDecline(request.id)}
          className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
        >
          <X size={16} />
        </button>
        <button 
          onClick={() => onAccept(request.id)}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 transition-colors"
        >
          <Check size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// --- EVENT CARD ---
interface EventCardProps {
  event: {
    title: string;
    date: string;
    location: string;
    attendees: string;
    image: string;
    type: string;
  }
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <div className="min-w-[260px] group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
    <img src={event.image} alt={event.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
    
    <div className="absolute top-3 left-3 z-20 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
      {event.type}
    </div>

    <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-white">
      <h4 className="font-bold text-base md:text-lg leading-tight mb-1">{event.title}</h4>
      <div className="flex items-center gap-3 text-xs text-gray-200 mb-2">
        <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
      </div>
      <div className="flex -space-x-2">
        {[1,2,3].map(i => (
          <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-300" />
        ))}
        <div className="w-6 h-6 rounded-full border border-white bg-purple-600 flex items-center justify-center text-[8px] font-bold">
          {event.attendees}
        </div>
      </div>
    </div>
  </div>
);

// --- SIDEBAR COMPONENT ---
interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  onLogout: () => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
  menuItems?: { id: string; icon: React.ReactNode; label: string; badge?: string }[];
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  collapsed, toggleCollapse, onLogout, currentView = 'overview', onViewChange, isMobileOpen, closeMobile, menuItems
}) => {
  const { t } = useTranslation();

  // Default Items if not provided (Translated)
  const items = menuItems || [
    { id: 'overview', icon: <Home size={20} />, label: t('dash.overview') },
    { id: 'matches', icon: <Users size={20} />, label: t('dash.matches'), badge: '12' },
    { id: 'search', icon: <Search size={20} />, label: t('dash.search') },
    { id: 'keyword-search', icon: <Tag size={20} />, label: t('dash.keySearch') },
    { id: 'advanced-search', icon: <SlidersHorizontal size={20} />, label: t('dash.advSearch') },
    { id: 'community-search', icon: <Globe size={20} />, label: t('dash.commSearch') },
    { id: 'connections', icon: <Users size={20} />, label: t('dash.requests') },
    { id: 'messages', icon: <MessageCircle size={20} />, label: t('dash.messages'), badge: '3' },
    { id: 'interests', icon: <Heart size={20} />, label: t('dash.interests') },
    { id: 'shortlist', icon: <Star size={20} />, label: t('dash.shortlist') },
    { id: 'activity', icon: <TrendingUp size={20} />, label: t('dash.activity') },
    { id: 'events', icon: <Calendar size={20} />, label: t('dash.events') },
    { id: 'visitors', icon: <Eye size={20} />, label: t('dash.visitors') },
    { id: 'photos', icon: <Camera size={20} />, label: t('dash.photos') },
    { id: 'horoscope', icon: <Moon size={20} />, label: t('dash.horoscope') },
    { id: 'verification', icon: <Shield size={20} />, label: t('dash.verification'), badge: '!' },
    { id: 'membership', icon: <Crown size={20} />, label: 'Membership' },
    { id: 'settings', icon: <Settings size={20} />, label: t('dash.settings') },
  ];

  // Mobile Drawer Overlay
  const MobileDrawer = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/10 lg:hidden flex flex-col shadow-2xl"
          >
             <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                   <Logo className="w-8 h-8" />
                   <span className="font-display font-bold text-xl">Divine Wedding</span>
                </div>
                <button onClick={closeMobile} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                   <X size={20} />
                </button>
             </div>
             {/* ... rest of mobile drawer ... */}
             <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-1">
                {items.map((item) => (
                   <button
                      key={item.id}
                      onClick={() => {
                         if (onViewChange) onViewChange(item.id);
                         closeMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                         currentView === item.id 
                         ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                         : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                   >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                         <span className="ml-auto text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                   </button>
                ))}
             </div>
             <div className="p-4 border-t border-gray-100 dark:border-white/5">
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium">
                   <LogOut size={20} /> {t('dash.logout')}
                </button>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileDrawer />
      
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ width: collapsed ? 80 : 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white/50 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 z-40 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
             <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3"
             >
                <Logo className="w-8 h-8" />
                <span className="font-display font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-white dark:to-gray-400">Divine Wedding</span>
             </motion.div>
          )}
          <button onClick={toggleCollapse} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors">
            {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ... Rest of Sidebar content ... */}
        <div className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onViewChange && onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                currentView === item.id 
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={`relative z-10 ${collapsed ? 'mx-auto' : ''}`}>{item.icon}</div>
              
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              
              {item.badge && !collapsed && (
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg ${item.badge === '!' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-red-500 shadow-red-500/30'} text-white`}>
                  {item.badge}
                </span>
              )}

              {currentView === item.id && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-purple-100 dark:bg-purple-900/20 rounded-xl" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
            <div className={`${collapsed ? 'mx-auto' : ''}`}><LogOut size={20} /></div>
            {!collapsed && <span className="font-medium">{t('dash.logout')}</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
};

// --- HEADER COMPONENT ---
export const DashboardHeader: React.FC<{ 
  toggleTheme: () => void, 
  darkMode: boolean, 
  onMenuClick: () => void 
}> = ({ toggleTheme, darkMode, onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-30 px-4 md:px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
           <Menu size={24} />
        </button>
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t('common.search')}
            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:border-purple-500/30 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:bg-white dark:focus:bg-black focus:shadow-lg focus:shadow-purple-500/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors"
        >
           {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-1 md:mx-2" />
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900 dark:text-white">Sribalamanigandan G</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">ID: MDM9823</div>
          </div>
          <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-lg group-hover:border-purple-500 transition-colors">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// --- MATCH CARD COMPONENT ---
interface MatchCardProps {
  match: {
    id?: string;
    name: string;
    age: number;
    height: string;
    job: string;
    location: string;
    image: string;
    matchScore: number;
  };
  delay?: number;
  onConnect?: (profile: any) => void;
  onInterest?: (profile: any) => void;
  onShortlist?: (profile: any) => void;
  onViewProfile?: (profile: any) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, delay = 0, onConnect, onInterest, onShortlist, onViewProfile }) => {
  const { t } = useTranslation();
  const [connecting, setConnecting] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [interested, setInterested] = useState(false);

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConnecting(true);
    setTimeout(() => {
        setConnecting(false);
        if(onConnect) onConnect(match);
    }, 1000);
  };

  const handleInterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInterested(true);
    if(onInterest) onInterest(match);
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShortlisted(!shortlisted);
    if(onShortlist) onShortlist(match);
  };

  return (
    <MagneticCard className="h-full w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="h-full flex flex-col bg-white dark:bg-[#121212] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group"
        role="article"
        aria-label={`Profile of ${match.name}`}
        onClick={() => onViewProfile && onViewProfile(match)}
      >
        {/* Image Section - Consistent Aspect Ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
          <img 
            src={match.image} 
            alt={match.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
            loading="lazy"
          />
          
          {/* Action Overlay (Desktop) */}
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button 
                onClick={handleShortlist}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${shortlisted ? 'bg-amber-400 text-white' : 'bg-black/30 text-white hover:bg-amber-400'}`}
             >
                <Star size={16} fill={shortlisted ? "currentColor" : "none"} />
             </button>
             <button 
                onClick={handleInterest}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${interested ? 'bg-pink-500 text-white' : 'bg-black/30 text-white hover:bg-pink-500'}`}
             >
                <Heart size={16} fill={interested ? "currentColor" : "none"} />
             </button>
          </div>

          {/* Match Score Badge */}
          <div className="absolute top-3 left-3 z-20">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
               <svg className="w-full h-full rotate-[-90deg] p-0.5">
                 <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
                 <motion.circle 
                   cx="50%" cy="50%" r="45%" 
                   stroke="#a855f7" strokeWidth="3" fill="none"
                   strokeDasharray="283"
                   strokeDashoffset={283 - (283 * match.matchScore) / 100}
                   initial={{ strokeDashoffset: 283 }}
                   whileInView={{ strokeDashoffset: 283 - (283 * match.matchScore) / 100 }}
                   transition={{ duration: 1.5, delay: 0.5 }}
                   strokeLinecap="round" 
                 />
               </svg>
               <span className="absolute text-[9px] md:text-[10px] font-bold text-white">{match.matchScore}%</span>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-4 z-20 text-white w-[calc(100%-2rem)]">
             <h3 className="text-lg md:text-xl font-bold truncate">{match.name}, {match.age}</h3>
             <p className="text-[10px] md:text-xs text-gray-300 flex items-center gap-1 mt-0.5"><Zap size={10} className="text-gold-400 fill-gold-400" /> Online</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1 gap-3">
           <div className="flex flex-col gap-1.5 flex-1 min-h-0">
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-xs md:text-sm font-medium truncate" title={match.job}>
                <BriefcaseIcon /> <span className="truncate">{match.job}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-500 flex items-center gap-2 text-xs md:text-sm truncate" title={match.location}>
                <MapPinIcon /> <span className="truncate">{match.location}</span>
              </p>
           </div>

           <div className="pt-2 flex gap-2 mt-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); onViewProfile && onViewProfile(match); }}
                className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                {t('dash.profile.view')}
              </button>
              <button 
                onClick={handleConnect}
                disabled={connecting}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
              >
                {connecting ? <Loader2 size={12} className="animate-spin" /> : t('dash.profile.connect')}
              </button>
           </div>
        </div>
      </motion.div>
    </MagneticCard>
  );
};

// --- STAT CARD COMPONENT ---
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-20 opacity-5 rounded-full blur-3xl ${color}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-500 flex items-center gap-0.5 bg-green-500/10 px-2 py-1 rounded-full">
            <TrendingUp size={10} /> {trend}
          </span>
        )}
      </div>
      
      <h4 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{value}</h4>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
};

// Icons helper
const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
)

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
)
