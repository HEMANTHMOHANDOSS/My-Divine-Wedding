
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, TrendingUp, DollarSign, Calendar, Search, Filter, 
  CheckCircle, XCircle, AlertCircle, Download, MoreHorizontal, 
  RefreshCw, RotateCcw, Crown, ChevronRight, PieChart
} from 'lucide-react';
import { AdminTable } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { KpiCard, SimpleBarChart } from './AdminWidgets';
import { MOCK_TRANSACTIONS, REVENUE_DATA } from '../../utils/adminData';

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  // Filter Data
  const filteredData = MOCK_TRANSACTIONS.filter(t => {
    const matchesSearch = t.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAction = () => {
    alert(`${activeAction === 'refund' ? 'Refund initiated' : 'Subscription cancelled'} for ${selectedTxn?.id}`);
    setSelectedTxn(null);
    setActiveAction(null);
  };

  const columns = [
    { key: 'id', label: 'Transaction ID', sortable: true, render: (val) => <span className="font-mono text-xs text-gray-500">{val}</span> },
    { key: 'userName', label: 'User', sortable: true, render: (_, t) => (
       <div className="flex items-center gap-3">
          <img src={t.userAvatar} className="w-8 h-8 rounded-full object-cover" />
          <div>
             <div className="font-bold text-gray-900 dark:text-white text-sm">{t.userName}</div>
             <div className="text-[10px] text-gray-500">{t.userId}</div>
          </div>
       </div>
    )},
    { key: 'plan', label: 'Plan', sortable: true, render: (val) => (
       <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
          ${val === 'Platinum' ? 'bg-slate-100 text-slate-700 border border-slate-300' : 
            val === 'Diamond' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' : 
            val === 'Gold' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-500'}
       `}>
          {val}
       </span>
    )},
    { key: 'amount', label: 'Amount', sortable: true, render: (val) => <span className="font-bold text-gray-900 dark:text-white">{val}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (val) => (
       <span className={`flex items-center gap-1 text-xs font-bold capitalize
          ${val === 'success' ? 'text-green-600' : val === 'failed' ? 'text-red-600' : 'text-amber-600'}
       `}>
          {val === 'success' ? <CheckCircle size={14} /> : val === 'failed' ? <XCircle size={14} /> : <RotateCcw size={14} />}
          {val}
       </span>
    )},
    { key: 'date', label: 'Date', sortable: true, render: (val) => <span className="text-xs text-gray-500">{val}</span> },
    { key: 'method', label: 'Method', render: (val) => <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{val}</span> }
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
         <KpiCard title="Total Revenue" value="₹45.2L" trend="+12.5%" icon={<DollarSign size={24} />} color="bg-green-500" />
         <KpiCard title="Active Subs" value="3,210" trend="+5.2%" icon={<Crown size={24} />} color="bg-purple-500" />
         <KpiCard title="Avg. Order Value" value="₹5,400" trend="+1.2%" icon={<TrendingUp size={24} />} color="bg-blue-500" />
         <KpiCard title="Refund Rate" value="0.4%" trend="-0.1%" icon={<RotateCcw size={24} />} color="bg-amber-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 shrink-0 h-[350px]">
         {/* Revenue Chart */}
         <div className="lg:col-span-2 bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg">Revenue Trends</h3>
               <select className="bg-gray-50 dark:bg-white/5 border-none text-xs font-bold rounded-lg py-1 px-2">
                  <option>Last 6 Months</option>
                  <option>This Year</option>
               </select>
            </div>
            <div className="flex-1 w-full flex items-end justify-between gap-2 px-2">
               {REVENUE_DATA.slice(-12).map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                     <div className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">₹{d.revenue/1000}k</div>
                     <motion.div 
                        initial={{ height: 0 }} animate={{ height: `${(d.revenue / 120000) * 100}%` }}
                        className="w-full bg-purple-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity relative"
                     >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-md" />
                     </motion.div>
                     <div className="text-[10px] text-gray-400 font-bold uppercase">{d.month}</div>
                  </div>
               ))}
            </div>
         </div>

         {/* Plan Distribution */}
         <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg flex flex-col">
            <h3 className="font-bold text-lg mb-6">Plan Distribution</h3>
            <div className="flex-1 flex items-center justify-center">
               <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="60 251" className="text-amber-500" /> {/* Gold */}
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="20" strokeDasharray="100 251" strokeDashoffset="-60" className="text-cyan-500" /> {/* Diamond */}
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#64748b" strokeWidth="20" strokeDasharray="91 251" strokeDashoffset="-160" className="text-slate-500" /> {/* Platinum */}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-bold">3.2k</span>
                     <span className="text-[10px] uppercase text-gray-500 font-bold">Subscribers</span>
                  </div>
               </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
               <div className="flex items-center gap-1 text-[10px] font-bold"><div className="w-2 h-2 rounded-full bg-amber-500" /> Gold</div>
               <div className="flex items-center gap-1 text-[10px] font-bold"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Diamond</div>
               <div className="flex items-center gap-1 text-[10px] font-bold"><div className="w-2 h-2 rounded-full bg-slate-500" /> Platinum</div>
            </div>
         </div>
      </div>

      {/* Transactions Table Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden">
         {/* Controls */}
         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <h3 className="font-bold text-lg flex items-center gap-2">
               <CreditCard size={20} className="text-purple-600" /> Recent Transactions
            </h3>
            
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search Transaction ID or User..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
                  />
               </div>
               <div className="relative group">
                  <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                     <Filter size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-10 p-1">
                     {['all', 'success', 'pending', 'failed', 'refunded'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-white/10">
                           {s}
                        </button>
                     ))}
                  </div>
               </div>
               <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                  <Download size={18} />
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-hidden">
            <AdminTable 
               data={filteredData}
               columns={columns}
               enableSearch={false} // Handled externally
               enableExport={false}
               actions={(item) => (
                  <div className="p-2 space-y-1 min-w-[140px]">
                     <button 
                        onClick={() => setSelectedTxn(item)} 
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2"
                     >
                        <AlertCircle size={14} /> Manage
                     </button>
                     <button className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2">
                        <Download size={14} /> Invoice
                     </button>
                  </div>
               )}
            />
         </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
         {selectedTxn && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => { setSelectedTxn(null); setActiveAction(null); }}
               />
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden"
               >
                  {!activeAction ? (
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className="font-bold text-lg">Manage Subscription</h3>
                              <p className="text-xs text-gray-500">Transaction #{selectedTxn.id}</p>
                           </div>
                           <button onClick={() => setSelectedTxn(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><XCircle size={20} /></button>
                        </div>

                        <div className="space-y-4 mb-6">
                           <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                              <img src={selectedTxn.userAvatar} className="w-10 h-10 rounded-full" />
                              <div>
                                 <p className="font-bold text-sm">{selectedTxn.userName}</p>
                                 <p className="text-xs text-gray-500">{selectedTxn.plan} Member</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 border rounded-xl">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Amount</p>
                                 <p className="font-bold">{selectedTxn.amount}</p>
                              </div>
                              <div className="p-3 border rounded-xl">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Expires</p>
                                 <p className="font-bold text-green-600">{selectedTxn.expiryDate}</p>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <button 
                              onClick={() => setActiveAction('refund')}
                              className="py-3 border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                           >
                              <RotateCcw size={16} /> Refund
                           </button>
                           <button 
                              onClick={() => setActiveAction('cancel')}
                              className="py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                           >
                              <XCircle size={16} /> Cancel Sub
                           </button>
                           <button className="col-span-2 py-3 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
                              Extend Validity (+30 Days)
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <AlertCircle size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Confirm {activeAction === 'refund' ? 'Refund' : 'Cancellation'}?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                           This action cannot be undone. The user will be notified immediately via email.
                        </p>
                        <div className="flex gap-3">
                           <button onClick={() => setActiveAction(null)} className="flex-1 py-2 font-bold text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Back</button>
                           <button onClick={handleAction} className="flex-1 py-2 font-bold text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-lg">Confirm</button>
                        </div>
                     </div>
                  )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPayments;
