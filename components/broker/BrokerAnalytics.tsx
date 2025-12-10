import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, PieChart, TrendingUp, Users, Calendar, Download, 
  Mail, Filter, RefreshCw, MapPin, Zap, BrainCircuit, ChevronDown,
  ArrowUpRight, Clock, FileText, Share2, CheckCircle, Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import { AnimatedSelect } from '../profile/ProfileFormElements';

// --- MOCK DATA ---
const ANALYTICS_DATA = {
  kpi: {
    conversionRate: 18.5,
    matchSuccess: 92,
    avgDaysToMatch: 45,
    activeLeads: 124
  },
  funnel: [
    { stage: 'New Leads', count: 124, color: 'bg-blue-500' },
    { stage: 'Profile Created', count: 98, color: 'bg-purple-500' },
    { stage: 'Interactions', count: 76, color: 'bg-pink-500' },
    { stage: 'Meetings', count: 42, color: 'bg-orange-500' },
    { stage: 'Matched', count: 23, color: 'bg-green-500' },
  ],
  communities: [
    { name: 'Iyer', success: 85, active: 40 },
    { name: 'Iyengar', success: 78, active: 35 },
    { name: 'Mudaliar', success: 92, active: 60 },
    { name: 'Nadar', success: 88, active: 55 },
    { name: 'Chettiar', success: 82, active: 30 },
  ],
  sources: [
    { name: 'Referral', value: 45, color: '#a855f7' },
    { name: 'Website', value: 30, color: '#3b82f6' },
    { name: 'Social', value: 15, color: '#ec4899' },
    { name: 'Offline', value: 10, color: '#f59e0b' },
  ],
  boostStats: {
    boostedViews: 1250,
    organicViews: 340,
    boostedClicks: 180,
    organicClicks: 25
  }
};

const BrokerAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [communityFilter, setCommunityFilter] = useState('All');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // --- GEMINI INSIGHTS ---
  const generateInsight = async () => {
    setIsAnalyzing(true);
    try {
      const apiKey = process.env.API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `Analyze this matrimony broker data: 
        Conversion Rate: ${ANALYTICS_DATA.kpi.conversionRate}%, 
        Community Success: Mudaliar (92%), Iyer (85%), 
        Lead Sources: Referral (45%), Website (30%).
        
        Provide 2 key strategic insights for the broker to improve business. 
        Format as bullet points. Keep it professional and concise.`;

        const result = await model.generateContent(prompt);
        setAiInsight(result.response.text());
      } else {
        // Fallback
        setTimeout(() => {
          setAiInsight(`
            • **Community Focus:** Your success rate with the Mudaliar community is exceptional (92%). Consider running targeted referral campaigns within this demographic to maximize ROI.
            • **Digital Optimization:** While referrals are strong, your website leads convert 15% slower. Review your landing page bio and featured profiles to improve trust for online leads.
          `);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      setAiInsight("Unable to generate insights at this moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    alert(`Exporting ${type.toUpperCase()} report...`);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="text-purple-600" /> Performance Analytics
          </h2>
          <p className="text-gray-500 text-sm mt-1">Track your agency growth and client success.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex">
              {['7d', '30d', '90d', 'YTD'].map(r => (
                 <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === r ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                 >
                    {r}
                 </button>
              ))}
           </div>
           
           <div className="flex gap-2">
              <button 
                 onClick={() => setShowScheduleModal(true)}
                 className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600 transition-colors"
                 title="Schedule Report"
              >
                 <Clock size={18} />
              </button>
              <button 
                 onClick={() => handleExport('csv')}
                 className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              >
                 <Download size={16} /> Export
              </button>
           </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard title="Conversion Rate" value={`${ANALYTICS_DATA.kpi.conversionRate}%`} trend="+2.4%" icon={<TrendingUp size={24} />} color="blue" />
         <KPICard title="Match Success" value={`${ANALYTICS_DATA.kpi.matchSuccess}%`} trend="+1.1%" icon={<CheckCircle size={24} />} color="green" />
         <KPICard title="Avg Time to Match" value={`${ANALYTICS_DATA.kpi.avgDaysToMatch} Days`} trend="-5 Days" icon={<Clock size={24} />} color="purple" />
         <KPICard title="Active Leads" value={ANALYTICS_DATA.kpi.activeLeads.toString()} trend="+12" icon={<Users size={24} />} color="orange" />
      </div>

      {/* AI INSIGHTS WIDGET */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                     <BrainCircuit size={20} className="text-yellow-300" />
                  </div>
                  <h3 className="font-bold text-lg">AI Business Intelligence</h3>
               </div>
               <button 
                  onClick={generateInsight}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
               >
                  {isAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
               </button>
            </div>
            
            <div className="bg-black/20 rounded-2xl p-6 border border-white/10 min-h-[100px]">
               {aiInsight ? (
                  <div className="prose prose-invert prose-sm">
                     {/* Rendering pseudo-markdown */}
                     {aiInsight.split('•').map((line, i) => (
                        line.trim() && (
                           <p key={i} className="mb-2 flex gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                           </p>
                        )
                     ))}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center text-white/50 h-full py-4">
                     <BrainCircuit size={32} className="mb-2 opacity-50" />
                     <p className="text-sm">Click generate to let AI identify growth opportunities in your data.</p>
                  </div>
               )}
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         
         {/* LEFT COL: CHARTS */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Conversion Funnel */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Client Conversion Funnel</h3>
                  <button className="text-gray-400 hover:text-purple-600"><Filter size={18} /></button>
               </div>
               <div className="space-y-4">
                  {ANALYTICS_DATA.funnel.map((item, idx) => (
                     <div key={item.stage} className="relative">
                        <div className="flex justify-between text-xs font-bold mb-1 px-1">
                           <span className="text-gray-700 dark:text-gray-300">{item.stage}</span>
                           <span className="text-gray-500">{item.count} Clients</span>
                        </div>
                        <div className="h-8 w-full bg-gray-100 dark:bg-white/5 rounded-r-xl overflow-hidden relative">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(item.count / 150) * 100}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className={`h-full ${item.color} opacity-80`}
                           />
                           <div className="absolute inset-0 flex items-center pl-3 text-[10px] font-bold text-white/80">
                              {Math.round((item.count / 124) * 100)}%
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Community Performance */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Most Active Communities</h3>
                  <select 
                     value={communityFilter} 
                     onChange={(e) => setCommunityFilter(e.target.value)}
                     className="bg-gray-100 dark:bg-white/5 border-none rounded-lg text-xs font-bold py-1 px-2 outline-none"
                  >
                     <option>All</option>
                     <option>Hindu</option>
                     <option>Christian</option>
                  </select>
               </div>
               
               <div className="h-64 flex items-end justify-between gap-4">
                  {ANALYTICS_DATA.communities.map((comm, idx) => (
                     <div key={comm.name} className="flex-1 flex flex-col justify-end h-full gap-2 group">
                        <div className="flex justify-center gap-1">
                           <div className="w-1/2 bg-purple-200 dark:bg-purple-900/30 rounded-t-lg relative group-hover:bg-purple-300 transition-colors h-full flex flex-col justify-end">
                              <motion.div 
                                 initial={{ height: 0 }} whileInView={{ height: `${comm.active}%` }} 
                                 className="w-full bg-purple-500 rounded-t-lg relative"
                              >
                                 <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-purple-600 bg-purple-100 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {comm.active}
                                 </span>
                              </motion.div>
                           </div>
                           <div className="w-1/2 bg-green-200 dark:bg-green-900/30 rounded-t-lg relative group-hover:bg-green-300 transition-colors h-full flex flex-col justify-end">
                              <motion.div 
                                 initial={{ height: 0 }} whileInView={{ height: `${comm.success}%` }} 
                                 className="w-full bg-green-500 rounded-t-lg relative"
                              >
                                 <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-600 bg-green-100 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {comm.success}%
                                 </span>
                              </motion.div>
                           </div>
                        </div>
                        <span className="text-[10px] text-center font-bold text-gray-500 uppercase truncate">{comm.name}</span>
                     </div>
                  ))}
               </div>
               <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold uppercase text-gray-400">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full" /> Active Profiles</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Success Rate</div>
               </div>
            </div>

         </div>

         {/* RIGHT COL: WIDGETS */}
         <div className="space-y-8">
            
            {/* Lead Sources Donut */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
               <h3 className="font-bold text-lg mb-6">Lead Sources</h3>
               <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                     {ANALYTICS_DATA.sources.map((source, i) => {
                        const dashArray = (source.value / 100) * 251.2;
                        const dashOffset = -251.2 * (ANALYTICS_DATA.sources.slice(0, i).reduce((a, b) => a + b.value, 0) / 100);
                        return (
                           <circle
                              key={source.name}
                              cx="50" cy="50" r="40"
                              fill="none"
                              stroke={source.color}
                              strokeWidth="20"
                              strokeDasharray={`${dashArray} 251.2`}
                              strokeDashoffset={dashOffset}
                              className="transition-all hover:stroke-width-24 cursor-pointer"
                           />
                        );
                     })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-bold">450</span>
                     <span className="text-[10px] uppercase text-gray-500 font-bold">Total Leads</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {ANALYTICS_DATA.sources.map(s => (
                     <div key={s.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{s.name} ({s.value}%)</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Geographic Heatmap */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" /> Client Heatmap
               </h3>
               <div className="grid grid-cols-10 gap-1 aspect-square bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  {Array.from({ length: 100 }).map((_, i) => {
                     const opacity = Math.random();
                     return (
                        <div 
                           key={i} 
                           className={`rounded-sm ${opacity > 0.7 ? 'bg-red-500' : opacity > 0.4 ? 'bg-orange-400' : 'bg-gray-200 dark:bg-white/10'}`}
                           style={{ opacity: Math.max(0.1, opacity) }}
                           title={`${Math.floor(opacity * 50)} Clients`}
                        />
                     );
                  })}
               </div>
               <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase font-bold">
                  <span>Low Density</span>
                  <span>High Density</span>
               </div>
            </div>

            {/* Boost Performance */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <Zap size={18} className="text-amber-500 fill-amber-500" /> Boost Impact
               </h3>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-xs mb-1 font-bold text-amber-800 dark:text-amber-200">
                        <span>Profile Views</span>
                        <span className="text-green-600">3.5x Higher</span>
                     </div>
                     <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 w-[78%]" />
                        <div className="bg-gray-300 w-[22%]" />
                     </div>
                     <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                        <span>Boosted ({ANALYTICS_DATA.boostStats.boostedViews})</span>
                        <span>Organic ({ANALYTICS_DATA.boostStats.organicViews})</span>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs mb-1 font-bold text-amber-800 dark:text-amber-200">
                        <span>Connect Requests</span>
                        <span className="text-green-600">7x Higher</span>
                     </div>
                     <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 w-[85%]" />
                        <div className="bg-gray-300 w-[15%]" />
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* SCHEDULE REPORT MODAL */}
      <AnimatePresence>
         {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)} />
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Mail size={20} className="text-purple-600" /> Schedule Reports
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Frequency</label>
                        <select className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none">
                           <option>Weekly (Mondays)</option>
                           <option>Monthly (1st)</option>
                           <option>Quarterly</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Format</label>
                        <div className="flex gap-4 mt-1">
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="fmt" defaultChecked className="accent-purple-600" /> <span className="text-sm">PDF Summary</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="fmt" className="accent-purple-600" /> <span className="text-sm">CSV Data</span>
                           </label>
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Recipients</label>
                        <input type="text" placeholder="email@agency.com" className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none" />
                     </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                     <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                     <PremiumButton onClick={() => { setShowScheduleModal(false); alert("Schedule Saved!"); }} className="flex-1">Save Schedule</PremiumButton>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, trend: string, icon: React.ReactNode, color: string }> = ({ title, value, trend, icon, color }) => (
   <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-lg relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150 duration-700 bg-${color}-500`} />
      <div className="flex justify-between items-start mb-4">
         <div className={`p-3 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
            {icon}
         </div>
         <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
         </span>
      </div>
      <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
   </motion.div>
);

export default BrokerAnalytics;