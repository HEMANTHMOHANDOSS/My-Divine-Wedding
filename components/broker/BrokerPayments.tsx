
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Download, FileText, CreditCard, 
  Landmark, ArrowUpRight, ArrowDownLeft, Calendar, 
  CheckCircle, AlertCircle, Clock, Shield, ChevronRight,
  PieChart, Wallet, ChevronDown, Printer
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AdminTable } from '../ui/AdminTable';
import { AnimatedInput } from '../profile/ProfileFormElements';

// --- MOCK DATA ---
const EARNINGS_DATA = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 72000 },
];

const TRANSACTIONS = [
  { id: 'TXN-9921', date: '2024-03-15', type: 'Credit', category: 'Commission', description: 'Match Fee: Arjun & Priya', amount: 15000, status: 'Completed' },
  { id: 'TXN-9920', date: '2024-03-12', type: 'Debit', category: 'Purchase', description: 'Premium Lead Pack (50)', amount: 5000, status: 'Completed' },
  { id: 'TXN-9918', date: '2024-03-10', type: 'Debit', category: 'Payout', description: 'Withdrawal to HDFC Bank', amount: 25000, status: 'Processed' },
  { id: 'TXN-9915', date: '2024-03-05', type: 'Credit', category: 'Bonus', description: 'Quarterly Performance Bonus', amount: 10000, status: 'Completed' },
  { id: 'TXN-9912', date: '2024-02-28', type: 'Credit', category: 'Commission', description: 'Match Fee: Suresh & Meena', amount: 15000, status: 'Completed' },
];

const INVOICES = [
  { id: 'INV-2024-001', date: '12 Mar 2024', item: 'Premium Lead Pack (50)', amount: '₹5,000', gst: '₹900', total: '₹5,900', status: 'Paid' },
  { id: 'INV-2024-002', date: '10 Feb 2024', item: 'Profile Booster Pack', amount: '₹2,500', gst: '₹450', total: '₹2,950', status: 'Paid' },
  { id: 'INV-2024-003', date: '01 Jan 2024', item: 'Annual Broker Subscription', amount: '₹10,000', gst: '₹1,800', total: '₹11,800', status: 'Paid' },
];

const BrokerPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'invoices' | 'settings'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  
  // Stats
  const availableBalance = 42500;
  const totalWithdrawn = 125000;
  const pendingClearance = 15000;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="text-emerald-600" /> Financial Center
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your commissions, payouts, and invoices.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500 uppercase font-bold">Next Payout</p>
              <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">Oct 15, 2024</p>
           </div>
           <PremiumButton 
              onClick={() => setShowPayoutModal(true)} 
              variant="gradient"
              icon={<ArrowUpRight size={18} />}
           >
              Withdraw Funds
           </PremiumButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-full md:w-fit overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'earnings', label: 'Earnings & Payouts', icon: TrendingUp },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'settings', label: 'Bank Settings', icon: Landmark },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
             <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                      <div className="relative z-10">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 rounded-xl"><Wallet size={24} /></div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">+12% this month</span>
                         </div>
                         <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
                         <h3 className="text-4xl font-display font-bold">₹{availableBalance.toLocaleString()}</h3>
                      </div>
                   </div>

                   <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Total Lifetime Earnings</p>
                      <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">₹{totalWithdrawn.toLocaleString()}</h3>
                   </div>

                   <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl"><Clock size={24} /></div>
                         <span className="text-xs text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Clearing in 3 days</span>
                      </div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Pending Clearance</p>
                      <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">₹{pendingClearance.toLocaleString()}</h3>
                   </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-gray-200 dark:border-white/5 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-bold">Revenue Analytics</h3>
                      <select className="bg-gray-100 dark:bg-white/5 border-none rounded-lg text-sm px-3 py-1 font-bold outline-none">
                         <option>Last 6 Months</option>
                         <option>This Year</option>
                      </select>
                   </div>
                   
                   <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                      {EARNINGS_DATA.map((d, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex justify-center">
                               <div 
                                  className="text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 whitespace-nowrap z-10"
                               >
                                  ₹{d.amount.toLocaleString()}
                               </div>
                            </div>
                            <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${(d.amount / 80000) * 100}%` }}
                               transition={{ duration: 1, delay: i * 0.1 }}
                               className="w-full bg-emerald-100 dark:bg-emerald-900/20 rounded-t-xl relative overflow-hidden group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40 transition-colors"
                            >
                               <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500" />
                            </motion.div>
                            <span className="text-xs font-bold text-gray-400 uppercase">{d.month}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'earnings' && (
             <div className="space-y-6">
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-200 dark:border-white/5 overflow-hidden">
                   <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Transaction History</h3>
                      <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                         <Download size={16} /> Export CSV
                      </button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                               <th className="px-6 py-4">Date / ID</th>
                               <th className="px-6 py-4">Description</th>
                               <th className="px-6 py-4">Type</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {TRANSACTIONS.map((txn) => (
                               <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                  <td className="px-6 py-4">
                                     <div className="font-bold text-sm text-gray-900 dark:text-white">{txn.date}</div>
                                     <div className="text-xs text-gray-500 font-mono">{txn.id}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="text-sm font-medium">{txn.description}</div>
                                     <div className="text-xs text-gray-500">{txn.category}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${txn.type === 'Credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {txn.type}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {txn.status === 'Completed' ? <CheckCircle size={14} className="text-green-500" /> : <Clock size={14} className="text-amber-500" />}
                                        {txn.status}
                                     </div>
                                  </td>
                                  <td className={`px-6 py-4 text-right font-mono font-bold ${txn.type === 'Credit' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                     {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'invoices' && (
             <div className="grid grid-cols-1 gap-6">
                {INVOICES.map((inv) => (
                   <div key={inv.id} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                            <FileText size={24} />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{inv.item}</h4>
                            <p className="text-xs text-gray-500">{inv.id} • {inv.date}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                         <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{inv.total}</p>
                            <p className="text-xs text-gray-500">Incl. {inv.gst} GST</p>
                         </div>
                         <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors"><Printer size={18} /></button>
                            <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors"><Download size={18} /></button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-lg">
                   <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <Landmark className="text-emerald-500" /> Banking Details
                   </h3>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-start gap-3">
                         <Shield size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                         <div>
                            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-200">KYC Verified</h4>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">Your banking details are verified and active for payouts.</p>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Account Holder Name" value="Divine Connections Agency" disabled />
                         <AnimatedInput label="Bank Name" value="HDFC Bank" disabled />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Account Number" value="•••• •••• •••• 8821" disabled />
                         <AnimatedInput label="IFSC Code" value="HDFC0001234" disabled />
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                         <h4 className="font-bold text-sm mb-4">UPI Configuration</h4>
                         <div className="flex gap-4 items-end">
                            <div className="flex-1">
                               <AnimatedInput label="UPI ID" value="agency@hdfc" disabled />
                            </div>
                            <button className="mb-6 text-sm font-bold text-emerald-600 hover:underline">Verify</button>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-8 flex justify-end">
                      <PremiumButton variant="outline">Edit Details</PremiumButton>
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* PAYOUT MODAL */}
      <AnimatePresence>
         {showPayoutModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowPayoutModal(false)}
               />
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }}
                  className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl p-8"
               >
                  <h3 className="text-2xl font-bold mb-2">Request Payout</h3>
                  <p className="text-sm text-gray-500 mb-6">Withdraw earnings to your verified bank account.</p>
                  
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-6 flex justify-between items-center">
                     <span className="text-sm font-bold text-gray-500">Available</span>
                     <span className="text-xl font-bold text-gray-900 dark:text-white">₹{availableBalance.toLocaleString()}</span>
                  </div>

                  <div className="space-y-4">
                     <AnimatedInput label="Amount to Withdraw" placeholder="Min ₹1,000" numericOnly />
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Transfer Method</label>
                        <select className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold outline-none">
                           <option>HDFC Bank - •••• 8821</option>
                           <option>UPI - agency@hdfc</option>
                        </select>
                     </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                     <button onClick={() => setShowPayoutModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">Cancel</button>
                     <PremiumButton className="flex-1" onClick={() => { alert('Request Submitted'); setShowPayoutModal(false); }}>Confirm</PremiumButton>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default BrokerPayments;
