
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, CreditCard, Shield, FileText, Settings, 
  LogOut, Bell, Search, Sun, Moon, TrendingUp, AlertTriangle,
  MessageSquare, UserPlus, Globe, Crown, Activity, Database, Smartphone, BarChart2,
  Moon as MoonIcon, Calendar, HelpCircle, Eye, Megaphone
} from 'lucide-react';

// --- SIDEBAR ---
interface AdminSidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const menu = [
    { section: 'Main', items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'parents', label: 'Parents Accounts', icon: UserPlus },
    ]},
    { section: 'Approvals', items: [
        { id: 'verification', label: 'KYC & Docs', icon: Shield, badge: '12' },
        { id: 'moderation', label: 'Content Moderation', icon: Eye, badge: '3' },
        { id: 'horoscope', label: 'Horoscope Mgmt', icon: MoonIcon, badge: '8' },
        { id: 'reports', label: 'Reports & Violations', icon: AlertTriangle, badge: '5' },
    ]},
    { section: 'Platform', items: [
        { id: 'events', label: 'Events & Meetups', icon: Calendar },
        { id: 'support', label: 'Support & Tickets', icon: HelpCircle, badge: '2' },
        { id: 'communication', label: 'Communication Logs', icon: MessageSquare, badge: '!' },
        { id: 'community', label: 'Community & Religion', icon: Globe },
        { id: 'membership', label: 'Plans & Pricing', icon: Crown },
        { id: 'payments', label: 'Transactions', icon: CreditCard },
        { id: 'ai-panel', label: 'Matchmaking AI', icon: Activity },
    ]},
    { section: 'System', items: [
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'cms', label: 'CMS Management', icon: FileText },
        { id: 'logs', label: 'System Logs', icon: Database },
        { id: 'settings', label: 'Settings & Roles', icon: Settings },
    ]}
  ];

  return (
    <div className="w-72 bg-white dark:bg-[#080808] border-r border-gray-200 dark:border-white/5 flex flex-col h-screen sticky top-0 z-40 shadow-xl transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-white/5">
        <img src="/logo.png" alt="Admin Logo" className="w-10 h-10 object-contain drop-shadow-md" />
        <div>
           <span className="font-display font-bold text-lg text-gray-900 dark:text-white block leading-none">Divine Admin</span>
           <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-widest">Control Center</span>
        </div>
      </div>

      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        {menu.map((section, idx) => (
          <div key={idx}>
             <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{section.section}</h4>
             <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                      currentView === item.id 
                      ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/10 text-cyan-700 dark:text-cyan-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <item.icon size={18} className={`transition-colors ${currentView === item.id ? 'text-cyan-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                    <span className="relative z-10">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {currentView === item.id && (
                       <motion.div layoutId="active-nav" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full" />
                    )}
                  </button>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

// ... keep AdminHeader, KpiCard, HeatmapWidget, SimpleBarChart same as before ...
export interface AdminHeaderProps {
  toggleTheme: () => void;
  darkMode: boolean;
  title: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleTheme, darkMode, title }) => {
  return (
    <header className="h-20 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
      <div>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{title.replace('-', ' ')}</h2>
         <p className="text-xs text-gray-500">Welcome back, Administrator</p>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/5 w-96 mx-4">
        <Search className="text-gray-400 ml-3" size={16} />
        <input 
          type="text" 
          placeholder="Global Search (Users, IDs, TXNs)..." 
          className="w-full bg-transparent border-none py-1.5 text-sm outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
        />
        <div className="bg-white dark:bg-black/40 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 border border-gray-200 dark:border-white/10 mr-1">⌘K</div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
        </button>
        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative border border-transparent hover:border-gray-200 dark:hover:border-white/10">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Admin User</p>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white dark:border-[#0a0a0a] shadow-lg cursor-pointer hover:scale-105 transition-transform">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export const KpiCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150 duration-700 ${color}`} />
    
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')} shadow-sm`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${trend.startsWith('+') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
        <TrendingUp size={12} className={trend.startsWith('-') ? 'rotate-180' : ''} /> {trend}
      </div>
    </div>
    
    <div>
       <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
       <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
    </div>
  </motion.div>
);

export const HeatmapWidget: React.FC = () => {
   const data = Array.from({ length: 84 }).map(() => Math.random());
   return (
      <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg h-full flex flex-col">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
               <Activity size={18} className="text-purple-500" /> User Activity Heatmap
            </h3>
            <select className="bg-gray-50 dark:bg-white/5 text-xs font-bold rounded-lg border-none outline-none py-1 px-2">
               <option>Last 24 Hours</option>
               <option>Last 7 Days</option>
            </select>
         </div>
         
         <div className="flex-1 grid grid-cols-12 gap-1.5 auto-rows-fr">
            {data.map((intensity, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={`rounded-sm relative group cursor-pointer ${
                     intensity > 0.8 ? 'bg-purple-600' : 
                     intensity > 0.6 ? 'bg-purple-500' : 
                     intensity > 0.4 ? 'bg-purple-400' : 
                     intensity > 0.2 ? 'bg-purple-300' : 'bg-gray-100 dark:bg-white/5'
                  }`}
                  style={{ opacity: Math.max(0.2, intensity) }}
               >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded z-10 whitespace-nowrap">
                     {Math.round(intensity * 100)} active users
                  </div>
               </motion.div>
            ))}
         </div>
         <div className="flex justify-between items-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
         </div>
      </div>
   )
}

export const SimpleBarChart: React.FC<{ data: number[], color?: string }> = ({ data, color = "bg-cyan-500" }) => (
  <div className="h-40 flex items-end justify-between gap-2 mt-4 px-2">
    {data.map((val, i) => (
      <div className="w-full flex flex-col justify-end h-full gap-2 group cursor-pointer" key={i}>
         <div className="text-center text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{val}</div>
         <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${val}%` }}
            transition={{ delay: i * 0.05, duration: 0.8, type: "spring" }}
            className={`w-full rounded-t-lg relative ${color} opacity-80 group-hover:opacity-100 transition-opacity`}
         >
            <div className="absolute top-0 inset-x-0 h-1 bg-white/30 rounded-t-lg" />
         </motion.div>
      </div>
    ))}
  </div>
);
