
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Filter, Search, MoreHorizontal, ChevronRight, X, Shield, 
  CheckCircle, AlertTriangle, Lock, Eye, MessageCircle, FileText, 
  CreditCard, MapPin, Phone, Mail, Calendar, Activity, RotateCcw,
  Ban, Trash2, Edit, Crown, Download, UserPlus
} from 'lucide-react';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { MOCK_ADMIN_USERS, AdminUser, MOCK_USER_AUDIT_LOGS } from '../../utils/adminData';

interface Filters {
  search: string;
  role: string;
  status: string;
  plan: string;
  verified: string;
  religion: string;
}

const AdminUserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reports'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  
  // Filter State
  const [filters, setFilters] = useState<Filters>({
    search: '', role: 'all', status: 'all', plan: 'all', verified: 'all', religion: 'all'
  });

  // Filter Logic
  useEffect(() => {
    let filtered = MOCK_ADMIN_USERS;
    
    if (activeTab === 'pending') filtered = filtered.filter(u => u.status === 'pending');
    if (activeTab === 'reports') filtered = filtered.filter(u => u.reports > 0);

    if (filters.role !== 'all') filtered = filtered.filter(u => u.role === filters.role);
    if (filters.status !== 'all') filtered = filtered.filter(u => u.status === filters.status);
    if (filters.plan !== 'all') filtered = filtered.filter(u => u.plan === filters.plan);
    if (filters.religion !== 'all') filtered = filtered.filter(u => u.religion === filters.religion);
    
    if (filters.search) {
       const q = filters.search.toLowerCase();
       filtered = filtered.filter(u => 
          u.name.toLowerCase().includes(q) || 
          u.email.toLowerCase().includes(q) || 
          u.id.toLowerCase().includes(q)
       );
    }

    setUsers(filtered);
  }, [filters, activeTab]);

  const handleAction = (action: string, user: AdminUser) => {
     alert(`${action} performed on ${user.name}`);
  };

  // --- COLUMNS CONFIG ---
  const columns: Column<AdminUser>[] = [
    { key: 'name', label: 'User Profile', sortable: true, render: (_, u) => (
      <div className="flex items-center gap-3">
         <div className="relative">
            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10" />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-black rounded-full flex items-center justify-center ${u.verified ? 'bg-green-500' : 'bg-gray-400'}`}>
               {u.verified && <CheckCircle size={10} className="text-white" />}
            </div>
         </div>
         <div>
            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
               {u.name}
               {u.safetyScore < 70 && <AlertTriangle size={12} className="text-amber-500" />}
            </div>
            <div className="text-xs text-gray-500">{u.id} • {u.age} yrs</div>
         </div>
      </div>
    )},
    { key: 'email', label: 'Contact', render: (_, u) => (
       <div className="text-xs">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><Mail size={10} /> {u.email}</div>
          <div className="flex items-center gap-1 text-gray-500"><Phone size={10} /> {u.mobile}</div>
       </div>
    )},
    { key: 'plan', label: 'Plan', sortable: true, render: (val) => (
       <span className={`
          px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border
          ${val === 'platinum' ? 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-300' : 
            val === 'diamond' ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300' : 
            val === 'gold' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300' : 
            'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400'}
       `}>
          {val}
       </span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (val) => (
       <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${val === 'active' ? 'bg-green-500' : val === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium capitalize">{val}</span>
       </div>
    )},
    { key: 'lastActive', label: 'Last Active', sortable: true, render: (val) => <span className="text-xs text-gray-500 font-mono">{val}</span> },
    { key: 'profileScore', label: 'Score', sortable: true, render: (val) => (
       <div className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${val > 80 ? 'bg-green-500' : val > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${val}%` }} />
       </div>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {['all', 'pending', 'reports'].map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                     activeTab === tab 
                     ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-white shadow-sm' 
                     : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
               >
                  {tab === 'reports' ? 'Violations' : tab === 'pending' ? 'Approvals' : 'All Users'}
                  {tab === 'pending' && <span className="ml-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">12</span>}
                  {tab === 'reports' && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">5</span>}
               </button>
            ))}
         </div>

         <div className="flex gap-2 w-full md:w-auto">
            <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-bold ${
                  showFilters 
                  ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 text-cyan-700 dark:text-cyan-300' 
                  : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
               }`}
            >
               <Filter size={16} /> Filters
            </button>
            <PremiumButton icon={<UserPlus size={16} />} className="!py-2.5 !px-4 !text-sm">Add User</PremiumButton>
         </div>
      </div>

      {/* ADVANCED FILTER BAR */}
      <AnimatePresence>
         {showFilters && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }} 
               animate={{ height: 'auto', opacity: 1 }} 
               exit={{ height: 0, opacity: 0 }}
               className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden"
            >
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                     <select 
                        value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-cyan-500"
                     >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Membership</label>
                     <select 
                        value={filters.plan} onChange={e => setFilters({...filters, plan: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-cyan-500"
                     >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="gold">Gold</option>
                        <option value="diamond">Diamond</option>
                        <option value="platinum">Platinum</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Verification</label>
                     <select 
                        value={filters.verified} onChange={e => setFilters({...filters, verified: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-cyan-500"
                     >
                        <option value="all">All</option>
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                     <select 
                        value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-cyan-500"
                     >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="parent">Parent</option>
                        <option value="broker">Broker</option>
                     </select>
                  </div>
               </div>
               <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button 
                     onClick={() => setFilters({search: '', role: 'all', status: 'all', plan: 'all', verified: 'all', religion: 'all'})}
                     className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                     <X size={12} /> Clear Filters
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* MAIN TABLE */}
      <div className="relative">
         <AdminTable 
            data={users}
            columns={columns}
            enableSearch={true}
            enableExport={true}
            onBulkAction={(ids) => alert(`Bulk delete ${ids.length} items`)}
            actions={(user) => (
               <div className="p-2 space-y-1 min-w-[140px]">
                  <button onClick={() => setSelectedUser(user)} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2">
                     <Eye size={14} /> View Details
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2">
                     <FileText size={14} /> Logs
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                  <button className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded flex items-center gap-2">
                     <Ban size={14} /> Suspend
                  </button>
               </div>
            )}
         />
      </div>

      {/* USER PROFILE SLIDER PANEL */}
      <AnimatePresence>
         {selectedUser && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSelectedUser(null)}
                  className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
               />
               <motion.div
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 right-0 h-full w-full md:w-[600px] xl:w-[700px] bg-white dark:bg-[#0a0a0a] z-[70] shadow-2xl border-l border-gray-200 dark:border-white/10 overflow-hidden flex flex-col"
               >
                  <UserProfilePanel user={selectedUser} onClose={() => setSelectedUser(null)} onAction={handleAction} />
               </motion.div>
            </>
         )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENT: USER PROFILE PANEL ---
const UserProfilePanel: React.FC<{ user: AdminUser; onClose: () => void; onAction: (action: string, user: AdminUser) => void }> = ({ user, onClose, onAction }) => {
   const [tab, setTab] = useState<'overview' | 'activity' | 'billing' | 'safety'>('overview');

   return (
      <div className="flex flex-col h-full">
         {/* HEADER */}
         <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex justify-between items-start mb-6">
               <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
               </button>
               <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50">
                     <Edit size={14} /> Edit
                  </button>
                  <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-100">
                     <Ban size={14} /> Block
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="relative">
                  <img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                  <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md text-white shadow-sm ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                     {user.status}
                  </span>
               </div>
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     {user.name} 
                     {user.plan !== 'free' && <Crown size={18} className="text-gold-500 fill-gold-500" />}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email} • {user.mobile}</p>
                  <div className="flex gap-3 mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                     <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                     <span className="flex items-center gap-1"><Calendar size={12} /> Joined: {user.joinedDate}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* TABS */}
         <div className="flex border-b border-gray-200 dark:border-white/10 px-6">
            {['overview', 'activity', 'safety', 'billing'].map(t => (
               <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`px-4 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${
                     tab === t 
                     ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                     : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
               >
                  {t}
               </button>
            ))}
         </div>

         {/* CONTENT */}
         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {tab === 'overview' && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 text-center">
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{user.profileScore}%</div>
                        <div className="text-[10px] uppercase font-bold text-purple-600/70">Completion</div>
                     </div>
                     <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 text-center">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{user.safetyScore}</div>
                        <div className="text-[10px] uppercase font-bold text-green-600/70">Trust Score</div>
                     </div>
                     <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-center">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">124</div>
                        <div className="text-[10px] uppercase font-bold text-blue-600/70">Profile Views</div>
                     </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider border-b border-gray-100 dark:border-white/5 pb-2">Personal Information</h4>
                     <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <InfoRow label="Age / Gender" value={`${user.age} / ${user.gender}`} />
                        <InfoRow label="Religion" value={user.religion} />
                        <InfoRow label="Caste" value={user.caste} />
                        <InfoRow label="Family Type" value={user.familyType || '-'} />
                        <InfoRow label="Education" value={user.education || '-'} />
                        <InfoRow label="Occupation" value={user.occupation || '-'} />
                        <InfoRow label="Annual Income" value={user.income || '-'} />
                     </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">About</h4>
                     <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{user.about}</p>
                  </div>
               </div>
            )}

            {tab === 'activity' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center">
                     <h4 className="font-bold">Audit Logs</h4>
                     <button className="text-xs text-cyan-600 font-bold flex items-center gap-1"><Download size={12} /> Export CSV</button>
                  </div>
                  <div className="space-y-4 relative">
                     <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
                     {MOCK_USER_AUDIT_LOGS.map((log) => (
                        <div key={log.id} className="relative pl-10">
                           <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-white dark:border-black" />
                           <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                              <div className="flex justify-between items-start">
                                 <span className="font-bold text-sm">{log.action}</span>
                                 <span className="text-xs text-gray-400">{log.timestamp}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                              <p className="text-[10px] text-gray-400 mt-1 font-mono">IP: {log.ip}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                     <h4 className="font-bold mb-4 flex items-center gap-2"><MessageCircle size={16} /> Communication Audit</h4>
                     <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 text-center">
                        <Lock size={24} className="mx-auto text-amber-600 mb-2" />
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Restricted Access</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">Viewing user chats requires Super Admin privilege validation.</p>
                        <button className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700">Request Access</button>
                     </div>
                  </div>
               </div>
            )}

            {tab === 'safety' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold uppercase text-gray-500">Reports Received</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.reports > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                           {user.reports} Reports
                        </span>
                     </div>
                     {user.reports > 0 ? (
                        <div className="space-y-3">
                           <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                              <p className="text-xs font-bold text-red-800 dark:text-red-300">Inappropriate Behavior</p>
                              <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">Reported by User #8821 on Oct 20</p>
                           </div>
                        </div>
                     ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Clean record. No violations reported.</p>
                     )}
                  </div>

                  <div>
                     <h4 className="font-bold text-sm mb-3">Verification Documents</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/20">
                           <FileText size={24} className="text-gray-400 mb-2" />
                           <span className="text-xs text-gray-500 font-bold">Aadhaar Front</span>
                           {user.verified && <span className="text-[10px] text-green-500 flex items-center gap-1 mt-1"><CheckCircle size={10} /> Verified</span>}
                        </div>
                        <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/20">
                           <FileText size={24} className="text-gray-400 mb-2" />
                           <span className="text-xs text-gray-500 font-bold">Aadhaar Back</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex gap-2">
                     <button className="flex-1 py-3 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 border border-red-200">Reset Verification</button>
                     <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 border border-gray-200">Force Password Reset</button>
                  </div>
               </div>
            )}
            
            {tab === 'billing' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-cyan-100 text-xs font-bold uppercase">Current Plan</p>
                           <h3 className="text-2xl font-bold capitalize mt-1">{user.plan} Membership</h3>
                        </div>
                        <Crown size={32} className="text-white/20" />
                     </div>
                     <div className="mt-6 flex justify-between items-end">
                        <div>
                           <p className="text-xs text-cyan-100">Expires On</p>
                           <p className="font-mono font-bold">Oct 24, 2024</p>
                        </div>
                        <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors">
                           Manage
                        </button>
                     </div>
                  </div>

                  <div>
                     <h4 className="font-bold text-sm mb-3">Transaction History</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg"><CreditCard size={16} /></div>
                              <div>
                                 <p className="text-sm font-bold text-gray-900 dark:text-white">Upgrade to {user.plan}</p>
                                 <p className="text-xs text-gray-500">Oct 24, 2023</p>
                              </div>
                           </div>
                           <span className="font-mono font-bold text-sm">₹6,999</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* FOOTER ACTIONS */}
         <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="grid grid-cols-2 gap-4">
               <button className="py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Reset Password
               </button>
               {user.verified ? (
                  <button className="py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-colors">
                     Message User
                  </button>
               ) : (
                  <button className="py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 shadow-lg shadow-green-500/30 transition-colors flex items-center justify-center gap-2">
                     <CheckCircle size={16} /> Approve Profile
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
   <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5">{label}</span>
      <span className="text-gray-900 dark:text-white font-medium">{value}</span>
   </div>
);

export default AdminUserManagement;
