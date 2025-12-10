
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Activity, Calendar, MessageSquare, 
  Settings, LogOut, Search, Bell, Plus, ChevronRight, Star, Phone, 
  Share2, Shield, TrendingUp, DollarSign, Sparkles, MoreVertical, 
  CheckCircle, XCircle, Filter, RefreshCw, Zap, Heart, AlertTriangle, User, Wallet,
  BarChart2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import BrokerProfile from './BrokerProfile';
import ClientManagement from './ClientManagement';
import BrokerPayments from './BrokerPayments';
import BrokerAnalytics from './BrokerAnalytics'; 
import BrokerCommunication from './BrokerCommunication';
import BrokerAppointments from './BrokerAppointments'; // New
import BrokerMatchmaking from './BrokerMatchmaking';   // New
import BrokerSettings from './BrokerSettings';         // New
import { MOCK_CLIENTS, MOCK_ACTIVITIES } from '../../utils/mockData';
import useTranslation from '../../hooks/useTranslation';
import Logo from '../ui/Logo';

interface BrokerDashboardProps {
  onLogout: () => void;
}

const BrokerDashboard: React.FC<BrokerDashboardProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Gemini Integration
  const generateDailyBriefing = async () => {
    setAnalyzing(true);
    setAiInsight(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        // Fallback Mock
        setTimeout(() => {
          setAiInsight("Based on recent activity, **Arjun Reddy** is showing high compatibility with 3 new profiles in the 'Iyer' community. Focus on scheduling a parent call for **Priya Sharma** as her profile views have dropped by 15% this week.");
          setAnalyzing(false);
        }, 2000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Act as a senior matchmaking consultant. Analyze the following client statuses: 
      1. Arjun (Active, High Matches)
      2. Priya (Review Needed, Moderate Matches)
      3. Ananya (Pending Verification)
      
      Provide a concise 2-sentence strategic advice summary for the broker to maximize success today. Highlight one urgent action.`;

      const result = await model.generateContent(prompt);
      setAiInsight(result.response.text());
    } catch (error) {
      setAiInsight("AI Service currently unavailable. Focus on pending verifications.");
    } finally {
      setAnalyzing(false);
    }
  };

  // --- ROUTING RENDERER ---
  const renderView = () => {
     switch(activeView) {
        case 'overview': return (
           <div className="max-w-7xl mx-auto space-y-8">
               {/* 1. KPI STATS */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard title={t('broker.clients')} value="48" trend="+12%" icon={<Users size={24} />} color="blue" />
                  <KPICard title={t('dash.pending')} value="15" trend="Urgent" icon={<Heart size={24} />} color="rose" />
                  <KPICard title={t('broker.earnings')} value="₹1.2L" trend="+8.5%" icon={<DollarSign size={24} />} color="emerald" />
                  <KPICard title="Success Rate" value="92%" trend="+2%" icon={<Activity size={24} />} color="purple" />
               </div>

               <div className="grid lg:grid-cols-3 gap-8 h-full">
                  <div className="lg:col-span-2 space-y-8">
                     {/* Gemini Widget */}
                     <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border border-white/10">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                 <Sparkles className="text-yellow-300" size={20} />
                                 <h3 className="font-bold text-lg">AI Broker Assistant</h3>
                              </div>
                              <button onClick={generateDailyBriefing} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                                 {analyzing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
                                 {analyzing ? 'Analyzing...' : 'Generate Brief'}
                              </button>
                           </div>
                           <div className="bg-black/20 rounded-xl p-4 border border-white/10 min-h-[80px]">
                              {aiInsight ? (
                                 <p className="text-sm leading-relaxed text-indigo-100">{aiInsight}</p>
                              ) : (
                                 <p className="text-sm text-white/50 italic">Click generate to get AI-driven insights on your client portfolio...</p>
                              )}
                           </div>
                        </div>
                     </div>
                     {/* Client Table Partial */}
                     <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden p-6">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold">Active Clients</h3>
                           <button onClick={() => setActiveView('clients')} className="text-xs text-purple-600 font-bold hover:underline">{t('common.viewAll')}</button>
                        </div>
                        {/* Compact Table */}
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="text-gray-500 text-xs uppercase font-bold">
                                 <tr><th className="pb-2">Client</th><th className="pb-2">Plan</th><th className="pb-2 text-right">Status</th></tr>
                              </thead>
                              <tbody>
                                 {MOCK_CLIENTS.slice(0, 3).map(c => (
                                    <tr key={c.id} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                                       <td className="py-2 text-sm font-bold">{c.name}</td>
                                       <td className="py-2 text-xs">{c.plan}</td>
                                       <td className="py-2 text-right text-xs"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{c.status}</span></td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     {/* Timeline */}
                     <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-lg text-gray-900 dark:text-white">Activity</h3>
                        </div>
                        <div className="space-y-6 relative">
                           <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-gray-100 dark:bg-white/5" />
                           {MOCK_ACTIVITIES.map((activity) => (
                              <div key={activity.id} className="flex gap-4 relative">
                                 <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white shadow-lg z-10 border-4 border-white dark:border-[#121212] ${activity.color}`}>
                                    {activity.type === 'match' ? <Heart size={14} /> : activity.type === 'payment' ? <DollarSign size={14} /> : activity.type === 'call' ? <Phone size={14} /> : <AlertTriangle size={14} />}
                                 </div>
                                 <div className="pt-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{activity.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        );
        case 'profile': return <BrokerProfile onBack={() => setActiveView('overview')} />;
        case 'clients': return <ClientManagement />;
        case 'payments': return <BrokerPayments />;
        case 'analytics': return <BrokerAnalytics />;
        case 'communication': return <BrokerCommunication />;
        case 'calendar': return <BrokerAppointments />;
        case 'matches': return <BrokerMatchmaking />;
        case 'settings': return <BrokerSettings />;
        default: return <div>View Not Found</div>;
     }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-500">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 z-20 shadow-2xl"
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
             <Shield size={24} />
          </div>
          {sidebarOpen && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 overflow-hidden whitespace-nowrap">
                <h1 className="font-display font-bold text-lg">Divine Broker</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('broker.title')}</p>
             </motion.div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
           {[
             { id: 'overview', label: t('dash.overview'), icon: LayoutDashboard },
             { id: 'profile', label: 'My Profile & Agency', icon: User },
             { id: 'clients', label: t('broker.clients'), icon: Users, badge: '4' },
             { id: 'matches', label: t('broker.matches'), icon: Sparkles },
             { id: 'analytics', label: 'Analytics', icon: BarChart2 },
             { id: 'calendar', label: 'Appointments', icon: Calendar },
             { id: 'communication', label: 'Comms Center', icon: MessageSquare, badge: '9+' },
             { id: 'payments', label: t('broker.earnings'), icon: Wallet },
             { id: 'settings', label: t('dash.settings'), icon: Settings },
           ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group relative ${
                   activeView === item.id 
                   ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                   : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                 <item.icon size={20} className={activeView === item.id ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                 {sidebarOpen && <span>{item.label}</span>}
                 {sidebarOpen && item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
                 )}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-white/5">
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-colors">
              <LogOut size={20} />
              {sidebarOpen && <span>{t('dash.logout')}</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         
         {/* Header */}
         <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hidden md:block">
                  {sidebarOpen ? <ChevronRight className="rotate-180" size={20} /> : <ChevronRight size={20} />}
               </button>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{activeView.replace('-', ' ')}</h2>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 rounded-full px-4 py-2 border border-gray-200 dark:border-white/10">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input type="text" placeholder={t('common.search')} className="bg-transparent border-none outline-none text-sm w-48" />
               </div>
               <button className="p-2.5 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 relative hover:scale-105 transition-transform">
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black" />
               </button>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 cursor-pointer" onClick={() => setActiveView('profile')}>
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
               </div>
            </div>
         </header>

         {/* Scrollable View Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {renderView()}
         </div>
      </main>
    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, trend: string, icon: React.ReactNode, color: string }> = ({ title, value, trend, icon, color }) => {
   const colorClasses = {
      blue: 'bg-blue-500 shadow-blue-500/30 text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      rose: 'bg-rose-500 shadow-rose-500/30 text-rose-600 bg-rose-50 dark:bg-rose-900/20',
      emerald: 'bg-emerald-500 shadow-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
      purple: 'bg-purple-500 shadow-purple-500/30 text-purple-600 bg-purple-50 dark:bg-purple-900/20'
   };
   
   return (
      <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-lg relative overflow-hidden group">
         <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(2).join(' ')}`}>
               {React.cloneElement(icon as React.ReactElement, { className: colorClasses[color as keyof typeof colorClasses].split(' ')[2] })}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
               {trend}
            </span>
         </div>
         <div>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
         </div>
      </motion.div>
   );
}

export default BrokerDashboard;
