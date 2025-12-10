
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
   Users, DollarSign, Shield, Activity, Eye, AlertTriangle, 
   Settings, MessageCircle, FileText, Database, CheckCircle, 
   XCircle, Sliders, Globe, Server, Lock, Crown, UserPlus
} from 'lucide-react';
import { AdminSidebar, AdminHeader, KpiCard, SimpleBarChart, HeatmapWidget } from './AdminWidgets';
import { AdminTable } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import AdminUserManagement from './AdminUserManagement';
import AdminVerification from './AdminVerification';
import AdminPayments from './AdminPayments';
import AdminReports from './AdminReports';
import AdminCommunication from './AdminCommunication';
import AdminHoroscope from './AdminHoroscope';
import AdminCommunity from './AdminCommunity';
import AdminEvents from './AdminEvents';
import AdminSupport from './AdminSupport';
import AdminModeration from './AdminModeration';
import AdminCMS from './AdminCMS';
import AdminSettings from './AdminSettings';
import { 
   ADMIN_STATS, MOCK_TRANSACTIONS, 
   MOCK_REPORTS, MOCK_LOGS 
} from '../../utils/adminData';

interface AdminDashboardProps {
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, toggleTheme, darkMode }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [aiWeights, setAiWeights] = useState({
     age: [20, 20] as [number, number],
     income: [30, 30] as [number, number],
     horoscope: [10, 10] as [number, number],
     location: [15, 15] as [number, number]
  });

  // --- VIEWS ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={ADMIN_STATS.revenue} trend={ADMIN_STATS.growth} icon={<DollarSign size={24} />} color="bg-green-500" />
        <KpiCard title="Active Users" value={ADMIN_STATS.activeUsers.toLocaleString()} trend="+8%" icon={<Users size={24} />} color="bg-blue-500" />
        <KpiCard title="AI Matches (24h)" value={ADMIN_STATS.aiMatchesToday.toLocaleString()} trend="+15%" icon={<Activity size={24} />} color="bg-purple-500" />
        <KpiCard title="Safety Score" value="98/100" trend="+2%" icon={<Shield size={24} />} color="bg-cyan-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 h-[400px]">
        {/* GROWTH CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Platform Growth</h3>
                <p className="text-sm text-gray-500">New registrations vs Premium conversions</p>
             </div>
             <button className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                Download Report
             </button>
          </div>
          <div className="flex-1 w-full">
             <SimpleBarChart data={[35, 55, 40, 65, 50, 75, 60, 85, 70, 95, 80, 100]} color="bg-gradient-to-t from-blue-500 to-cyan-400" />
          </div>
        </div>
        
        {/* HEATMAP */}
        <div className="h-full">
           <HeatmapWidget />
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid md:grid-cols-3 gap-6">
         {[
            { label: 'Review Pending Docs', count: ADMIN_STATS.pendingVerifications, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { label: 'High Priority Reports', count: ADMIN_STATS.reportedProfiles, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
            { label: 'Server Load', count: '45%', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/10' }
         ].map((item, i) => (
            <div key={i} className={`p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow ${item.bg}`}>
               <span className={`font-bold ${item.color}`}>{item.label}</span>
               <span className={`text-2xl font-display font-bold ${item.color}`}>{item.count}</span>
            </div>
         ))}
      </div>
    </div>
  );

  const renderAI = () => (
     <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           <div className="relative z-10 flex justify-between items-center">
              <div>
                 <h2 className="text-3xl font-display font-bold mb-2">Matchmaking Algorithm Control</h2>
                 <p className="text-purple-200 max-w-xl">Adjust the weightage of parameters used in the global matchmaking scoring engine. Changes apply instantly to new searches.</p>
              </div>
              <div className="hidden md:block">
                 <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Activity size={40} className="animate-pulse" />
                 </div>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Control Panel */}
           <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-lg">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                 <Sliders size={20} className="text-purple-600" /> Parameter Weights
              </h3>
              
              <div className="space-y-8">
                 {[
                    { label: 'Age Gap Sensitivity', key: 'age', val: aiWeights.age, desc: 'Higher values penalize age gaps more strictly.' },
                    { label: 'Income Matching', key: 'income', val: aiWeights.income, desc: 'Importance of financial compatibility.' },
                    { label: 'Horoscope / Guna', key: 'horoscope', val: aiWeights.horoscope, desc: 'Weight of astrological scores.' },
                    { label: 'Geo-Location Proximity', key: 'location', val: aiWeights.location, desc: 'Importance of distance.' }
                 ].map((item: any) => (
                    <div key={item.key}>
                       <div className="flex justify-between mb-2">
                          <label className="font-bold text-sm text-gray-700 dark:text-gray-300">{item.label}</label>
                          <span className="font-mono font-bold text-purple-600">{item.val[0]}%</span>
                       </div>
                       <GradientRangeSlider 
                          min={0} max={100} step={5}
                          value={item.val} 
                          onChange={(v) => setAiWeights(prev => ({...prev, [item.key]: v}))}
                       />
                       <p className="text-xs text-gray-400 mt-2">{item.desc}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-4">
                 <button className="text-sm font-bold text-gray-500 hover:text-gray-900">Reset to Default</button>
                 <PremiumButton className="!py-3 !px-6 !text-sm">Save Configuration</PremiumButton>
              </div>
           </div>

           {/* Metrics */}
           <div className="space-y-6">
              <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-md">
                 <h4 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Real-time Metrics</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium">Average Match Score</span>
                       <span className="text-xl font-bold text-green-500">72%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden"><div className="w-[72%] h-full bg-green-500" /></div>
                    
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium">Successful Connections</span>
                       <span className="text-xl font-bold text-blue-500">4.5%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden"><div className="w-[45%] h-full bg-blue-500" /></div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
                 <Activity size={100} className="absolute -right-4 -bottom-4 text-white/5" />
                 <h4 className="font-bold text-lg mb-2">AI Diagnostics</h4>
                 <p className="text-sm text-gray-400 mb-4">System is performing optimally. Last training model updated 2 hours ago.</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1"><CheckCircle size={10} /> Model v2.4</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1"><Server size={10} /> 12ms Latency</span>
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const renderLogs = () => (
     <div className="space-y-6">
        <AdminTable 
           title="System Audit Logs"
           data={MOCK_LOGS}
           columns={[
              { key: 'timestamp', label: 'Timestamp', render: (val) => <span className="font-mono text-xs text-gray-500">{val}</span> },
              { key: 'action', label: 'Action Performed', render: (val) => <span className="font-bold text-sm">{val}</span> },
              { key: 'admin', label: 'Admin User' },
              { key: 'ip', label: 'IP Address', render: (val) => <span className="font-mono text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{val}</span> },
              { key: 'status', label: 'Result', render: (val) => (
                 val === 'success' ? <span className="text-green-500"><CheckCircle size={16} /></span> : 
                 val === 'warning' ? <span className="text-amber-500"><AlertTriangle size={16} /></span> : 
                 <span className="text-red-500"><XCircle size={16} /></span>
              )}
           ]}
        />
     </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-cyan-500 selection:text-white">
      <AdminSidebar currentView={currentView} onChangeView={setCurrentView} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader toggleTheme={toggleTheme} darkMode={darkMode} title={currentView} />
        
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentView === 'overview' && renderOverview()}
                
                {(currentView === 'users' || currentView === 'parents') && <AdminUserManagement />}
                
                {currentView === 'verification' && <AdminVerification />}

                {currentView === 'payments' && <AdminPayments />}

                {currentView === 'reports' && <AdminReports />}

                {currentView === 'communication' && <AdminCommunication />}

                {currentView === 'horoscope' && <AdminHoroscope />}

                {currentView === 'community' && <AdminCommunity />}

                {currentView === 'events' && <AdminEvents />}
                {currentView === 'support' && <AdminSupport />}
                {currentView === 'moderation' && <AdminModeration />}
                {currentView === 'cms' && <AdminCMS />}
                {currentView === 'settings' && <AdminSettings />}

                {currentView === 'ai-panel' && renderAI()}
                {currentView === 'logs' && renderLogs()}
                
                {['announcements'].includes(currentView) && (
                   <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                      <Settings size={48} className="mb-4 opacity-50 animate-spin-slow" />
                      <h3 className="text-xl font-bold">Module Coming Soon</h3>
                      <p>This premium admin feature is under development.</p>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
